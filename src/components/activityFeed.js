import React, { Component } from 'react';
import Divider from '@mui/material/Divider';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Grid from '@mui/material/Grid';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';

class activityfeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tmpItems: [],
            isLoaded: false,
        }
        this.archiveAllCalls = this.archiveAllCalls.bind(this);
    }

    componentDidMount() {
        //get all calls
        fetch('https://aircall-job.herokuapp.com/activities')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            });
    }
    //refreshing the page
    refreshpage() {
        window.location.reload(false);
    }

    archiveallCalls = async () => {

        const delay = ms => new Promise(res => setTimeout(res, ms));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_archived: true })
        };
        //archive all calls
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

        var { isLoaded, tmpItems, items } = this.state;

        const unArchiveItems = items.filter(items => {
            return (items.is_archived === false);
        });
        //store unarchived calls to tmpItems array
        for (let i = 0; i < unArchiveItems.length; i++) {
            tmpItems.push(unArchiveItems[i].id)
            console.log(tmpItems[i]);
        }

        if (!isLoaded) {
            return <div>Loading...</div>
        }

        return (
            <div className="activity">
                <br />
                <div className="card" onClick={this.archiveallCalls} >
                    <div className="icon">
                        <ArchiveOutlinedIcon />
                    </div>
                    <p className="title">Archive all calls</p>
                </div>

                {unArchiveItems.map(item => (

                    <ul key={item.id} onClick={() => { this.props.history.push(`/detail/${item.id}`) }}>
                        <br />

                        <Divider> {new Date(item.created_at).toLocaleDateString()}</Divider><br />
                        <div className="card">
                            <Grid>
                                <div className="icon">
                                    {item.call_type === "answered" ? <PhoneInTalkIcon /> : <PhoneCallbackIcon />}
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
export default activityfeed;
