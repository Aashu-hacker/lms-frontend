import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Alert,
  Box,
  Card,
  Button,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

// assets
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScienceIcon from '@mui/icons-material/Science';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import REACT_APP_BASE_URL from 'utils/api';

const ngsOptions = [
  { label: 'Single-cell RNA-seq (scRNA-seq)', value: 'Single-cell RNA-seq (scRNA-seq)' },
  { label: 'Bulk RNA-seq (short-read)', value: 'Bulk RNA-seq (short-read)' },
  { label: 'Whole-genome sequencing (WGS)', value: 'Whole-genome sequencing (WGS)' },
  { label: 'Whole-exome sequencing (WES)', value: 'Whole-exome sequencing (WES)' },
  { label: 'Bulk ATAC-seq', value: 'Bulk ATAC-seq' },
  { label: 'MERSCOPE', value: 'MERSCOPE' },
  { label: 'Visium', value: 'Visium' },
  { label: 'Proteomics (LC-MS/MS, DIA, TMT)', value: 'Proteomics (LC-MS/MS, DIA, TMT)' },
  { label: 'Clinical omics (liquid biopsy, cfDNA, ctDNA)', value: 'Clinical omics (liquid biopsy, cfDNA, ctDNA)' }
];

const steps = ['Project Details', 'Team Assignment', 'NGS Applications'];

export default function AddProject() {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [managers, setManagers] = useState([]);
  const [analysts, setAnalysts] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    priority: 'Medium',
    dueDate: '',
    projectOwners: [],
    analysts: [],
    ngsApplications: []
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const completion = useMemo(() => {
    let score = 0;
    if (form.title) score += 25;
    if (form.shortDescription) score += 15;
    if (form.projectOwners.length) score += 20;
    if (form.analysts.length) score += 20;
    if (form.ngsApplications.length) score += 20;
    return score;
  }, [form]);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      // 🔹 Get all users once
      const res = await axios.get(`${REACT_APP_BASE_URL}/users`, {
        headers: authHeaders
      });

      const users = res.data || [];

      // 🔹 Managers only
      const managerUsers = users.filter((user) => user.role?.toLowerCase() === 'manager');

      // 🔹 Analysts only
      const analystUsers = users.filter((user) => user.role?.toLowerCase() === 'analyst');

      // 🔹 Optional combined technical users (manager + analyst)
      const technicalUsers = users.filter((user) => user.role?.toLowerCase() !== 'admin' && user.role?.toLowerCase() !== 'client');

      // 🔹 Manager dropdown
      setManagers([
        { value: 'add_new', label: '➕ Add New User' },
        ...managerUsers.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`
        }))
      ]);

      // 🔹 Analyst dropdown
      setAnalysts([
        { value: 'add_new', label: '➕ Add New User' },
        ...analystUsers.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`
        }))
      ]);

      // 🔹 If you also want a combined non-admin/non-client list:
      setTeamMembers([
        { value: 'add_new', label: '➕ Add New User' },
        ...technicalUsers.map((user) => ({
          value: user._id,
          label: `${user.name} (${user.email})`
        }))
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field, selected) => {
    if (selected?.some((item) => item.value === 'add_new')) {
      navigate('/admin/users');
      return;
    }

    setForm({
      ...form,
      [field]: selected || []
    });
  };

  const validateStep = () => {
    if (activeStep === 0 && !form.title) {
      setError('Project title is required');
      return false;
    }

    if (activeStep === 1 && !form.projectOwners.length) {
      setError('At least one project owner is required');
      return false;
    }

    setError('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        shortDescription: form.shortDescription,
        priority: form.priority,
        dueDate: form.dueDate,
        projectOwners: form.projectOwners.map((item) => item.value),
        analysts: form.analysts.map((item) => item.value),
        ngsApplications: form.ngsApplications.map((item) => item.value)
      };

      const data = await axios.post(`${REACT_APP_BASE_URL}/projects`, payload, {
        headers: authHeaders
      });

      console.log(data);
      navigate('/admin/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: 56,
      borderRadius: 12,
      borderColor: '#d0d7de',
      boxShadow: 'none',
      '&:hover': {
        borderColor: theme.palette.secondary.main
      }
    }),
    multiValue: (base) => ({
      ...base,
      borderRadius: 8
    })
  };

  return (
    <MainCard
      title={
        <Stack direction="row" alignItems="center" spacing={1}>
          <AutoAwesomeIcon color="secondary" />
          <Typography variant="h3">Create Project</Typography>
        </Stack>
      }
      secondary={
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/projects')}>
          Back to Projects
        </Button>
      }
      sx={{
        borderRadius: 4
      }}
    >
      <CardContent>
        {/* Completion */}
        <Box mb={4}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1">Form Completion</Typography>
            <Chip label={`${completion}%`} color="secondary" />
          </Stack>
          <LinearProgress variant="determinate" value={completion} sx={{ height: 10, borderRadius: 10 }} />
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1 */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth select label="Priority" name="priority" value={form.priority} onChange={handleChange}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Short Description"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
              />
            </Grid>
          )}

          {/* STEP 2 */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Project Owners
                </Typography>

                <Select
                  isMulti
                  options={managers}
                  styles={selectStyles}
                  isLoading={loadingUsers}
                  onChange={(selected) => handleSelectChange('projectOwners', selected)}
                  placeholder="Search managers or add new user"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Assigned Analysts
                </Typography>

                <Select
                  isMulti
                  options={analysts}
                  styles={selectStyles}
                  isLoading={loadingUsers}
                  onChange={(selected) => handleSelectChange('analysts', selected)}
                  placeholder="Select analysts or add new user"
                />
              </Grid>
            </Grid>
          )}

          {/* STEP 3 */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  NGS Applications
                </Typography>

                <CreatableSelect
                  isMulti
                  isSearchable
                  options={ngsOptions}
                  styles={selectStyles}
                  value={form.ngsApplications}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      ngsApplications: selected || []
                    })
                  }
                  placeholder="Search, select or create custom applications"
                />
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              {activeStep > 0 && (
                <Button onClick={handleBack} size="large">
                  Back
                </Button>
              )}
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/projects')}>
                Cancel
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button variant="contained" color="secondary" onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </MainCard>
  );
}
