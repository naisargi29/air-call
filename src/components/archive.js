import React, { Component } from 'react';
import Divider from '@mui/material/Divider';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Grid from '@mui/material/Grid';

class archive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tmpItems: [],
            isLoaded: false,
        }
        this.unArchiveAllCalls = this.unArchiveAllCalls.bind(this);
    }

    componentDidMount() {
        fetch('https://aircall-job.herokuapp.com/activities')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            });
    }
    //refresh page
    refreshpage() {
        window.location.reload(false);
    }
    unArchiveAllCalls = async () => {

        const delay = ms => new Promise(res => setTimeout(res, ms));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_archived: false })
        };
        //unarchive all calls
        for (let i = 0; i < this.state.tmpItems.length; i++) {
            fetch(`https://aircall-job.herokuapp.com/activities/${this.state.tmpItems[i]}`, requestOptions)
                .then(response => response.json())
                .then(data => this.setState({ items: data.id }));
        }
        //wait to archive all data
        await delay(300);

        this.refreshpage();
    }

    render() {

        var { isLoaded, tmpItems } = this.state;

        //filter archived calls
        const archiveItems = this.state.items.filter(item => {
            return (item.is_archived === true);
        });

        //store archived calls to tmpItems array
        for (let i = 0; i < archiveItems.length; i++) {
            tmpItems.push(archiveItems[i].id)
            console.log(tmpItems[i]);
        }

        if (!isLoaded) {
            return <div>Loading...</div>
        }

        return (
            <div className="activity">
                <br />
                <div className="card" onClick={this.unArchiveAllCalls} >
                    <div className="icon">
                        <ArchiveOutlinedIcon />
                    </div>
                    <p className="title">Unarchive all calls</p>
                </div>
                {archiveItems.map(item => (
                    <ul key={item.id} onClick={() => { this.props.history.push(`/detail/${item.id}`) }}>
                        <br />
                        <Divider> {new Date(item.created_at).toLocaleDateString()}</Divider><br />
                        <div className="card">
                            <Grid>
                                <div className="icon">
                                    <PhoneCallbackIcon />
                                </div>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <span className="title"> {item.from} <br /></span>
                                tried to call on {item.via}<br />
                            </Grid>
                            <Grid>
                                <span className="time">
                                    {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                            </Grid>
                        </div>

                    </ul>
                ))};
            </div>
        )
    }
}

export default archive;