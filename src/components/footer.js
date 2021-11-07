import React, { Component } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Badge from '@mui/material/Badge';
import Toolbar from '@mui/material/Toolbar';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import StyledFab from '@mui/material/Fab';
import AppsIcon from '@mui/icons-material/Apps';

class footer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
    }
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

  render() {

    //filter Unarchived
    const unArchiveItems = this.state.items.filter(item => {
      return (item.is_archived === false);
    });

    //the number of unarchived phone call for Badge
    var len = unArchiveItems.length;
    console.log(len);

    return (
      <footer>
        <div>
          <Toolbar>
            <div className="tabIcon">
              <Badge badgeContent={len} color="primary">
                <LocalPhoneIcon color="action" />
              </Badge>
            </div>
            <div className="tabIcon">
              <PersonOutlineIcon />
            </div>
            <div className="tabIcon">
              <StyledFab color="secondary" aria-label="keypad">
                <AppsIcon />
              </StyledFab>
            </div>
            <div className="tabIcon">
              <SettingsOutlinedIcon />
            </div>
            <div className="tabIcon">
              <VoicemailIcon />
            </div>
          </Toolbar>
        </div>
      </footer>
    );
  };
};
export default footer;