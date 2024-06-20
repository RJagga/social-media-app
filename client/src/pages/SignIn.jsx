// import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {

    const { setIsAuth, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");


    const handleLogin = async (event) => {
        //to prevent the page from refreshing 
        event.preventDefault();
        
        const data = new FormData(event.currentTarget);
       
        const email = data.get('email');
        const password = data.get('password');
      
        const newUser = { email, password };

        if (email === "" || password === "") {
            setError("Enter Correct Input");
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_ADDR}/auth/login`, {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: {
                "content-type": "application/json",
            },
            credentials: "include",
        });

        try {
            if (response.ok) {
                const result = await response.json();
                console.log(result);
                setIsAuth(true)
                setUser(result.user)
                console.log(document.cookie);
                navigate("/");
            } else {
                const errorData = await response.json();
                setError(errorData.error);
            }
        } catch (error) {
            setError("Enter Correct Input");
        }
    };

    const handleSignUp = async (event) => {
        //to prevent the page from refreshing 
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const name = data.get('name');
        const email= data.get('email');
        const password= data.get('password');
        
        const newUser = { name, email, password };
    
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_ADDR}/auth/register`, {
          method: "POST",
          body: JSON.stringify(newUser),
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        });
    
        try {
          if (response.ok) {
            const result = await response.json();
            // console.log(result);
            setIsAuth(true)
            setUser(result.user)
            // setName("");
            // setPassword("");
            // setEmail("");
            navigate("/");
          } else {
            const errorData = await response.json();
            setError(errorData.error);
          }
        } catch (error) {
          setError("Enter Correct Input");
        }
    };
    
    return (
        <>
            {isLogin ? (
                //SIGN-IN
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid item>
                                        <Link onClick={() => setIsLogin(false)} variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                    </Container>
                </ThemeProvider>
            ) : (
                //SIGNUP
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign up
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <TextField
                                            autoComplete="given-name"
                                            name="name"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Name"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                        />
                                    </Grid>

                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Link onClick={() => setIsLogin(true)} variant="body2">
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                    </Container>
                </ThemeProvider>
            )}
        </>

    );
}