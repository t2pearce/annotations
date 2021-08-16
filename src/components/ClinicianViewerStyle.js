import { makeStyles } from '@material-ui/core/styles';
const drawerWidth = 300;

export const useStyles = makeStyles((theme) => ({

  /* QUESTION/TIMER/LEFT SECTION */
  'question-section': {
    width: "100%",
    position: "relative"
  },

  'question-count': {
    marginBottom: 20
  },

  'question-count': {
     span: {
      fontSize: 28}
  },

  'question-text': {
    marginBottom: 12
  },

  'timer-text': {
    background: 'rgb(230, 153, 12)',
    padding: 15,
    marginTop: 20,
    marginRight: 20,
    border: '5px solid rgb(255, 189, 67)',
    borderRadius: 15,
    textAlign: "center"
  },

  /* ANSWERS/RIGHT SECTION */
  'answer-section': {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  'question-button': {
    width: "100%",
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "#252d4a",
    borderRadius: 15,
    display: "flex",
    padding: 5,
    justifyContent: "flex-start",
    alignItems: "center",
    border: '5px solid #234668',
    cursor: "pointer"
  },

  correct: {
    backgroundColor: "#2f922f"
  },

  incorrect: {
    backgroundColor: "#ff3333"
  },

  button: {
    hover: {
    backgroundColor: "#555e7d"}
  },

  button: {
    focus: {
    outline: "none"}
  },

  button: {
    svg: {
    marginRight: 5}
  },
  formControl: {
    margin: theme.spacing(5),
    minWidth: 120,
    padding: theme.spacing(5),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingLeft: 24, // keep left padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginRight: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    textAlign: 'center',
  },
  fixedHeight: {
    paddingTop: 2,
    position: "absolute",
    top: "55%",
    right: "50%",
    transform: "translate(50%, -50%)"
  },
  paperShift: {
    marginRight: 150,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0),
    },
  },
}));
