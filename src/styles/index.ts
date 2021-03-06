import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { Shadows } from "@material-ui/core/styles/shadows"
import green from '@material-ui/core/colors/green'

export const theme = createMuiTheme({
  typography: {
    fontFamily: 'Muli, Arial',
  },
  palette: {
    primary: green
  },
  // shadows: Array(25).fill("none") as Shadows,
});
const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    // maxHeight: "100%",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  avatar: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: theme.palette.secondary.main,

  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
        margin: theme.spacing(3, 0, 2),
      },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  noEvents: {
    pointerEvents: "none"
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    fontSize: "1.1rem"
  },
  hovering: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    backgroundColor: "pink",
    pointerEvents: "none",
    fontSize: "1.1rem"
  },
  fixedHeight: {
    height: 240,
  },
  center: {
    marginLeft: "auto",
    marginRight: "auto"
  },
  borderlessInputModal: {
    border: "none",
    borderColor: "transparent",
    fontSize: "1.5rem",
    fontFamily: theme.typography.fontFamily,
    outline: "none",
    minWidth: "100px"
  },
  borderlessInputBar: {
    border: "none",
    borderColor: "transparent",
    fontSize: "1.5rem",
    fontFamily: theme.typography.fontFamily,
    outline: "none",
    fontWight: "400",
    lineHeight: "1.334",
    background: "inherit"
  },
  borderlessInputPaper: {
    fontSize: "1.1rem",
    border: "none",
    borderColor: "transparent",
    fontFamily: theme.typography.fontFamily,
    outline: "none",
    minWidth: "100px"
  },
    labelModal: {
    fontSize: "1.5rem",
    fontFamily: theme.typography.fontFamily,
    marginRight: "10px"
  }
}));
