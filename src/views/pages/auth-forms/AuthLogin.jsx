import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import REACT_APP_BASE_URL from 'utils/api';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function AuthLogin() {
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ form state
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ LOGIN API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post(`${REACT_APP_BASE_URL}/auth/login`, form);

      const { token, user } = res.data;

      // ✅ Clear previous user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');

      // ✅ Store new login data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role); // adjust field name if needed

      // Optional: Store permissions if API returns them
      if (user.permissions) {
        localStorage.setItem('permissions', JSON.stringify(user.permissions));
      }

      // ✅ Update state/context if using React Context or Redux
      // dispatch(setUser(user));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate('/dashboard/default', {
          replace: true
        });

        // Force menu reload based on new role
        // window.location.reload();
      }, 1500);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid credentials'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomFormControl fullWidth>
        <InputLabel>Email Address</InputLabel>
        <OutlinedInput type="email" name="email" value={form.email} onChange={handleChange} required />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </CustomFormControl>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
            label="Keep me logged in"
          />
        </Grid>
        <Grid>
          <Typography component={Link} to="#!" variant="subtitle1" sx={{ textDecoration: 'none', color: 'secondary.main' }}>
            Forgot Password?
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button color="secondary" fullWidth size="large" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
