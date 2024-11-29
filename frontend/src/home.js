import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  Button,
  Paper,
} from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import ClearIcon from "@material-ui/icons/Clear";
import backgroundImage from "./images.jpg";
import axios from "axios";

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: "#282c34",
  },
  grow: {
    flexGrow: 1,
  },
  mainContainer: {
    background: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "100%", // Ensure full width
    height: "100vh", // Full viewport height
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  
  card: {
    maxWidth: 500,
    margin: "auto",
    padding: theme.spacing(3),
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
  },
  dropzone: {
    border: "2px dashed #ccc",
    borderRadius: "10px",
    padding: "50px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      borderColor: theme.palette.primary.main,
    },
    transition: "background-color 0.3s, border-color 0.3s",
  },
  dropzoneText: {
    color: "#777",
    fontSize: "16px",
  },
  media: {
    height: 300,
    borderRadius: "10px",
  },
  detail: {
    marginTop: theme.spacing(2),
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    padding: theme.spacing(2),
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  clearButton: {
    marginTop: theme.spacing(2),
    width: "100%",
    fontWeight: "bold",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10,
    borderRadius: "15px",
  },
  table: {
    "& .MuiTableCell-root": {
      borderBottom: "none",
    },
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const sendFile = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(process.env.REACT_APP_API_URL, formData);
      setData(res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    sendFile();
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0]);
      setData(null);
    },
    accept: "image/*",
  });

  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6">Potato Disease Classification</Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
      <Container className={classes.mainContainer}>
        <Card className={classes.card}>
          {isLoading && (
            <div className={classes.loaderOverlay}>
              <CircularProgress />
            </div>
          )}
          {!preview && (
            <div {...getRootProps()} className={classes.dropzone}>
              <input {...getInputProps()} />
              <Typography className={classes.dropzoneText}>
                {isDragActive
                  ? "Drop the file here..."
                  : "Drag & drop an image, or click to select one"}
              </Typography>
            </div>
          )}
          {preview && (
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Uploaded Preview"
                className={classes.media}
                image={preview}
              />
            </CardActionArea>
          )}
          {data && (
            <CardContent className={classes.detail}>
              <TableContainer component={Paper}>
                <Table size="small" className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Label</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{data.class}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          )}
          <ColorButton
            className={classes.clearButton}
            startIcon={<ClearIcon />}
            onClick={clearData}
          >
            Clear
          </ColorButton>
        </Card>
      </Container>
    </>
  );
};
