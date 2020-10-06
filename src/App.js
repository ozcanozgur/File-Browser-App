import React, { useEffect, useState } from "react";
import {
  Container,
  LinearProgress,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";

import axios from "./axios";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import ComputerIcon from "@material-ui/icons/Computer";
import BackspaceIcon from "@material-ui/icons/Backspace";

function App() {
  const [folders, setFolders] = useState([]);
  const [isLoading, setLoader] = useState(true);
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:8080/api/folders/",
    })
      .then((obj) => {
        setFolders(obj.data);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        alert("You Don't Have Permission To Access to the File");
      });
  }, []);

  const classes = useStyles();

  const handleClick = (folder) => {
    //setOpen(!open);
    console.log(folder);

    axios({
      method: "get",
      url: "http://localhost:8080/api/folders/" + "?name=" + folder,
    })
      .then((obj) => {
        setFolders(obj.data);
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        alert("You Don't Have Permission To Access to the File");
      });
  };
  return (
    <div className="App">
      <Container>
        <Grid container spacing={3} className={classes.mainGrid}>
          <Grid item xs={12} sm={4}>
            <img src={require("./images/logo.png")} alt="logo" />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.grid}>
            <Typography variant="h4">File Browser</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <img
              src={require("./images/logo2.png")}
              alt="logo2"
              className={classes.image}
            />
          </Grid>
        </Grid>
        <Paper elevation={3}>
          {isLoading || folders === 0 ? (
            <LinearProgress color="secondary" />
          ) : (
            <List component="nav" aria-label="main mailbox folders">
              <ListItem>
                <ListItemIcon>
                  <ComputerIcon />
                </ListItemIcon>
                <ListItemText primary={folders[0].name} />
                <ListItemText
                  style={{ display: "flex", justifyContent: "flex-end" }}
                  primary="Current Path"
                />
              </ListItem>
              <Divider />
              <ListItem
                button
                disabled={folders[1].name == null ? true : false}
                onClick={() => handleClick(folders[1].name)}
              >
                <ListItemIcon>
                  <BackspaceIcon />
                </ListItemIcon>
                <ListItemText primary={folders[1].name} />
              </ListItem>
              <Divider />
              {folders.slice(2, folders.length).map((folder, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    button
                    disabled={folder.size === 0 ? false : true}
                    onClick={() =>
                      handleClick(folders[0].name + "/" + folder.name)
                    }
                  >
                    <ListItemIcon>
                      {folder.size === 0 ? <FolderIcon /> : <FileIcon />}
                    </ListItemIcon>
                    <ListItemText primary={folder.name} />
                    <ListItemText
                      style={{ display: "flex", justifyContent: "flex-end" }}
                      primary={
                        folder.size === 0
                          ? null
                          : "Size : " + folder.size + " kb"
                      }
                    />
                  </ListItem>
                  {index === folders.length - 1 ? null : <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  grid: {
    height: 100,
    textAlign: "center",
  },
  mainGrid: {
    marginBottom: 20,
    marginTop: 20,
  },
  image: { width: 250, height: 100, float: "right" },
}));
