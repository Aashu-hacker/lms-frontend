import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

// ==============================|| NGS APPLICATION OPTIONS ||============================== //
const ngsOptions = [
  // ==============================|| EXPRESSION PROFILING ||============================== //
  {
    label: 'Expression Profiling',
    options: [
      { label: 'Single-cell RNA-seq (scRNA-seq)', value: 'Single-cell RNA-seq (scRNA-seq)' },
      { label: 'Bulk RNA-seq (short-read)', value: 'Bulk RNA-seq (short-read)' },
      {
        label: 'Bulk RNA-seq (long-read; e.g., Iso-Seq, Nanopore)',
        value: 'Bulk RNA-seq (long-read; e.g., Iso-Seq, Nanopore)'
      },
      {
        label: 'Single-cell BCR/TCR-seq (scBCR-seq / scTCR-seq)',
        value: 'Single-cell BCR/TCR-seq (scBCR-seq / scTCR-seq)'
      },
      { label: 'Single-nucleus RNA-seq (snRNA-seq)', value: 'Single-nucleus RNA-seq (snRNA-seq)' },
      {
        label: 'Spatially resolved transcriptomics (low-plex vs high-plex distinction)',
        value: 'Spatially resolved transcriptomics (low-plex vs high-plex distinction)'
      },
      { label: 'Total RNA-seq (including non-coding RNAs)', value: 'Total RNA-seq (including non-coding RNAs)' },
      { label: 'Small RNA-seq (miRNA, piRNA)', value: 'Small RNA-seq (miRNA, piRNA)' },
      { label: 'Ribosome profiling (Ribo-seq; translation-level)', value: 'Ribosome profiling (Ribo-seq; translation-level)' },
      {
        label: 'Nascent transcription assays (GRO-seq, PRO-seq)',
        value: 'Nascent transcription assays (GRO-seq, PRO-seq)'
      }
    ]
  },

  // ==============================|| GENOMIC VARIATIONS ||============================== //
  {
    label: 'Genomic Variations',
    options: [
      { label: 'Whole-genome sequencing (WGS)', value: 'Whole-genome sequencing (WGS)' },
      { label: 'Whole-exome sequencing (WES)', value: 'Whole-exome sequencing (WES)' },
      { label: 'Targeted sequencing panels', value: 'Targeted sequencing panels' },
      { label: 'Copy number variation (CNV-seq / shallow WGS)', value: 'Copy number variation (CNV-seq / shallow WGS)' },
      {
        label: 'Structural variation (SV detection; long-read or paired-end)',
        value: 'Structural variation (SV detection; long-read or paired-end)'
      },
      { label: 'Single-cell DNA-seq', value: 'Single-cell DNA-seq' },
      { label: 'Mitochondrial genome sequencing', value: 'Mitochondrial genome sequencing' }
    ]
  },

  // ==============================|| EPIGENOME ||============================== //
  {
    label: 'Epigenome',
    options: [
      { label: 'Bulk ChIP-seq', value: 'Bulk ChIP-seq' },
      { label: 'Bulk ATAC-seq', value: 'Bulk ATAC-seq' },
      { label: 'Bisulfite sequencing (WGBS)', value: 'Bisulfite sequencing (WGBS)' },
      {
        label: 'Reduced Representation Bisulfite Sequencing (RRBS)',
        value: 'Reduced Representation Bisulfite Sequencing (RRBS)'
      },
      { label: 'Single-cell ATAC-seq (scATAC-seq)', value: 'Single-cell ATAC-seq (scATAC-seq)' },
      {
        label: 'Single-cell ChIP-seq (scChIP-seq; still emerging)',
        value: 'Single-cell ChIP-seq (scChIP-seq; still emerging)'
      },
      { label: 'CUT&RUN', value: 'CUT&RUN' },
      { label: 'CUT&Tag', value: 'CUT&Tag' },
      { label: 'Hi-C / 3C / 4C / 5C (chromatin conformation)', value: 'Hi-C / 3C / 4C / 5C (chromatin conformation)' },
      { label: 'Single-cell multiome (scRNA + scATAC)', value: 'Single-cell multiome (scRNA + scATAC)' }
    ]
  },

  // ==============================|| SPATIAL PROFILING ||============================== //
  {
    label: 'Spatial Profiling',
    options: [
      { label: 'MERSCOPE', value: 'MERSCOPE' },
      { label: 'Visium', value: 'Visium' },
      { label: 'Xenium', value: 'Xenium' },
      { label: 'Slide-seq / Slide-seqV2', value: 'Slide-seq / Slide-seqV2' },
      { label: 'Stereo-seq', value: 'Stereo-seq' },
      { label: 'MERFISH / seqFISH', value: 'MERFISH / seqFISH' },
      { label: 'Imaging mass cytometry (IMC)', value: 'Imaging mass cytometry (IMC)' },
      { label: 'CODEX', value: 'CODEX' }
    ]
  },

  // ==============================|| GENOME RECONSTRUCTION ||============================== //
  {
    label: 'Genome Reconstruction',
    options: [
      { label: 'Short-read genome assembly', value: 'Short-read genome assembly' },
      { label: 'Long-read genome assembly (PacBio / Nanopore)', value: 'Long-read genome assembly (PacBio / Nanopore)' },
      { label: 'Hybrid assembly (short + long reads)', value: 'Hybrid assembly (short + long reads)' },
      { label: 'Hi-C scaffolding', value: 'Hi-C scaffolding' },
      { label: 'Metagenome-assembled genomes (MAGs)', value: 'Metagenome-assembled genomes (MAGs)' },
      { label: 'Pangenome construction', value: 'Pangenome construction' }
    ]
  },

  // ==============================|| MICROBIAL DIVERSITY ||============================== //
  {
    label: 'Microbial Diversity',
    options: [
      { label: 'Amplicon sequencing (16S/18S/ITS)', value: 'Amplicon sequencing (16S/18S/ITS)' },
      { label: 'Shotgun metagenomics', value: 'Shotgun metagenomics' },
      { label: 'Metatranscriptomics', value: 'Metatranscriptomics' },
      { label: 'Metaproteomics', value: 'Metaproteomics' },
      { label: 'Metabolomics (microbiome-associated)', value: 'Metabolomics (microbiome-associated)' },
      { label: 'Single-cell genomics (microbial)', value: 'Single-cell genomics (microbial)' }
    ]
  },

  // ==============================|| MULTI-OMICS / CUSTOMIZED ||============================== //
  {
    label: 'Other (Multi-omics / Customized)',
    options: [
      { label: 'Proteomics (LC-MS/MS, DIA, TMT)', value: 'Proteomics (LC-MS/MS, DIA, TMT)' },
      { label: 'Phosphoproteomics', value: 'Phosphoproteomics' },
      { label: 'Metabolomics (LC-MS, GC-MS)', value: 'Metabolomics (LC-MS, GC-MS)' },
      { label: 'Lipidomics', value: 'Lipidomics' },
      { label: 'Single-cell proteomics (CyTOF, CITE-seq)', value: 'Single-cell proteomics (CyTOF, CITE-seq)' },
      {
        label: 'Multi-omics integration (e.g., scRNA + ATAC + protein)',
        value: 'Multi-omics integration (e.g., scRNA + ATAC + protein)'
      },
      { label: 'Perturb-seq / CRISPR screens', value: 'Perturb-seq / CRISPR screens' },
      { label: 'Lineage tracing (CRISPR barcoding)', value: 'Lineage tracing (CRISPR barcoding)' },
      { label: 'Synthetic spike-ins (e.g., SIRVs, ERCC)', value: 'Synthetic spike-ins (e.g., SIRVs, ERCC)' },
      {
        label: 'Clinical omics (liquid biopsy, cfDNA, ctDNA)',
        value: 'Clinical omics (liquid biopsy, cfDNA, ctDNA)'
      }
    ]
  },

  // ==============================|| OTHER ||============================== //
  {
    label: 'Other',
    options: [{ label: 'Custom / User Defined', value: 'Custom / User Defined' }]
  }
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

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        shortDescription: form.shortDescription,
        priority: form.priority,
        dueDate: form.dueDate,

        // ✅ Send manager IDs
        manager: (form.projectOwners || []).map((item) => item.value),

        // ✅ Send analyst IDs
        analysts: (form.analysts || []).map((item) => item.value),

        // ✅ Send NGS Applications
        ngsApplications: (form.ngsApplications || []).map((item) => item.value || item.label)
      };

      // ✅ Correct axios response variable
      const response = await axios.post(`${REACT_APP_BASE_URL}/projects`, payload, {
        headers: authHeaders
      });

      // ==============================|| SUCCESS ALERT ||============================== //
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data?.message || 'Project created successfully!',
        confirmButtonColor: '#3085d6'
      });

      // Optional reset form
      // setForm(initialState);

      navigate('/admin/projects');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create project';

      setError(errorMessage);

      console.error('Project Create Error:', err);

      // ==============================|| ERROR ALERT ||============================== //
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: errorMessage,
        confirmButtonColor: '#d33'
      });
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

        <Box
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && activeStep !== steps.length - 1) {
              e.preventDefault();
            }
          }}
        >
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
                  value={form.projectOwners}
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
                  value={form.analysts}
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
            // ==============================|| COMPONENT ||============================== //
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
                  placeholder="Type or select NGS applications..."
                  removeSelected={false}
                  formatGroupLabel={(group) => <div style={{ fontWeight: 700, fontSize: 13 }}>{group.label}</div>}
                />
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Actions */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              {activeStep > 0 && (
                <Button type="button" onClick={handleBack} size="large">
                  Back
                </Button>
              )}
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => navigate('/admin/projects')}>
                Cancel
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button type="button" variant="contained" color="secondary" onClick={handleNext}>
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
                  onClick={handleSubmit}
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </MainCard>
  );
}
