// ==============================|| PROJECTS LIST PAGE ||============================== //

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import Swal from 'sweetalert2';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  Grid,
  Fade,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

// icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import ScienceIcon from '@mui/icons-material/Science';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveIcon from '@mui/icons-material/Save';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteIcon from '@mui/icons-material/Delete';

import MainCard from 'ui-component/cards/MainCard';
import REACT_APP_BASE_URL from 'utils/api';

// ==============================|| HELPERS ||============================== //

const getProgressColor = (progress) => {
  if (progress < 30) return 'error';
  if (progress < 70) return 'warning';
  return 'success';
};

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

const getSafeValue = (value, fallback = 'N/A') => {
  try {
    if (value === null || value === undefined || value === '') return fallback;

    if (Array.isArray(value)) {
      return value.length ? value.map((v) => getSafeValue(v)).join(', ') : fallback;
    }

    if (typeof value === 'object') {
      return value.label || value.value || value.name || value.title || fallback;
    }

    return String(value);
  } catch {
    return fallback;
  }
};

const formatDate = (date) => {
  if (!date) return 'Not set';

  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return 'Not set';
  }
};

// ==============================|| MAIN COMPONENT ||============================== //

export default function ProjectsListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [managers, setManagers] = useState([]);
  const [analysts, setAnalysts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // view modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProject, setViewProject] = useState(null);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: editProject?.title || '',
    shortDescription: editProject?.shortDescription || '',
    priority: editProject?.priority || 'Medium',
    status: editProject?.status || 'Active',
    dueDate: editProject?.dueDate ? new Date(editProject.dueDate).toISOString().split('T')[0] : '',
    progress: editProject?.progress || 0,

    // ✅ Safe Manager (single object)
    manager: editProject?.manager?._id
      ? {
          value: editProject.manager._id,
          label: `${editProject.manager.name || 'Unknown'} (${editProject.manager.email || 'No Email'})`
        }
      : null,

    // ✅ Safe Analysts
    analysts: Array.isArray(editProject?.analysts)
      ? editProject.analysts.map((analyst) => ({
          value: analyst?._id || '',
          label: `${analyst?.name || 'Unknown'} (${analyst?.email || 'No Email'})`
        }))
      : [],

    // ✅ Safe NGS Applications
    ngsApplications: Array.isArray(editProject?.ngsApplications)
      ? editProject.ngsApplications.map((app) => ({
          value: typeof app === 'object' ? app?.value || app?.label || '' : app || '',
          label: typeof app === 'object' ? app?.label || app?.value || '' : app || ''
        }))
      : []
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
  // ==============================|| FETCH PROJECTS ||============================== //
  const fetchProjects = async () => {
    try {
      setLoading(true);

      // ✅ Get logged-in user details from localStorage / auth context
      const user = JSON.parse(localStorage.getItem('user'));
      // Expected: user._id, user.role

      const res = await axios.get(`${REACT_APP_BASE_URL}/projects`, {
        headers: authHeaders
      });

      const allProjects = res.data || [];

      // ==============================|| ROLE BASED FILTER ||============================== //
      let filteredProjects = allProjects;

      if (user?.role?.toLowerCase() === 'manager') {
        // ✅ Show only projects assigned to this manager
        filteredProjects = allProjects.filter((project) => {
          if (Array.isArray(project.manager)) {
            return project.manager.some((manager) => manager?._id === user._id);
          }

          return project.manager?._id === user._id;
        });
      } else if (user?.role?.toLowerCase() === 'analyst') {
        // ✅ Show only projects assigned to this analyst
        filteredProjects = allProjects.filter((project) => project.analysts?.some((analyst) => analyst?._id === user._id));
      } else if (user?.role?.toLowerCase() === 'admin') {
        // ✅ Admin sees all projects
        filteredProjects = allProjects;
      } else {
        // ✅ Optional fallback for unknown roles
        filteredProjects = [];
      }

      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      // 🔹 Get all users once
      const res = await axios.get(`${REACT_APP_BASE_URL}/users`, {
        headers: authHeaders
      });

      const users = res.data || [];

      // console.log(users);

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
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // ==============================|| VIEW PROJECT ||============================== //
  const handleView = (project) => {
    setViewProject(project);
    setViewOpen(true);
  };

  // ==============================|| EDIT PROJECT ||============================== //
  const handleOpenEdit = (project) => {
    setEditProject(project);
    console.log('Editing Project:', project);

    setForm({
      title: project.title || '',
      shortDescription: project.shortDescription || '',
      priority: project.priority || 'Medium',
      dueDate: project.dueDate ? project.dueDate.split('T')[0] : '',
      progress: project.progress || 0,
      status: project.status || 'Active',

      // ✅ Normalize managers
      managers: project.manager
        ? [
            {
              value: project.manager._id || '',
              label: `${project.manager.name || ''} (${project.manager.email || ''})`
            }
          ]
        : [],

      // ✅ Normalize analysts
      analysts: (project.analysts || []).filter(Boolean).map((user) => ({
        value: user._id || user.value,
        label: `${user.name || user.label} (${user.email || ''})`
      })),

      // ✅ Normalize NGS apps
      ngsApplications: (project.ngsApplications || []).map((app) =>
        typeof app === 'string'
          ? { value: app, label: app }
          : {
              value: app.value || app.label || app.name,
              label: app.label || app.name || app.value
            }
      )
    });

    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setEditProject(null);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field, selected) => {
    // console.log('Selected:', field, selected);
    if (selected?.some((item) => item.value === 'add_new')) {
      navigate('/admin/users');
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: selected || []
    }));
  };

  const payload = {
    title: form.title,
    shortDescription: form.shortDescription,
    priority: form.priority,
    dueDate: form.dueDate,
    progress: form.progress,
    status: form.status,

    // ✅ Send only IDs
    // ✅ Manager should be single ID (not managers array)
    manager: form.managers && form.managers.length > 0 ? form.managers[0].value : null,
    analysts: (form.analysts || []).map((item) => item.value),

    ngsApplications: (form.ngsApplications || []).map((item) => item.value || item.label)
  };

  // console.log(payload);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSubmitting(true);

      const response = await axios.put(`${REACT_APP_BASE_URL}/projects/${editProject._id}`, payload, {
        headers: authHeaders
      });

      // Success Alert
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Project updated successfully!',
        confirmButtonColor: '#3085d6'
      });

      handleCloseEdit();
      fetchProjects();
    } catch (err) {
      console.error('Update Error:', err);

      // Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong while updating the project.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setSaving(false);
      setSubmitting(false);
    }
  };

  // ==============================|| DELETE PROJECT ||============================== //
  const handleDeleteProject = async (projectId, projectTitle) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: `Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete It'
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const response = await axios.delete(`${REACT_APP_BASE_URL}/projects/${projectId}`, {
        headers: authHeaders
      });

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: response.data.message || 'Project deleted successfully.',
        confirmButtonColor: '#3085d6'
      });

      fetchProjects(); // Refresh project list
    } catch (error) {
      console.error('Delete Error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.response?.data?.message || 'Something went wrong while deleting the project.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============================|| FILTER ||============================== //
  const filteredProjects = projects.filter((project) => {
    const q = search.toLowerCase();

    return (
      project.title?.toLowerCase().includes(q) ||
      project.projectId?.toLowerCase().includes(q) ||
      project.createdBy?.name?.toLowerCase().includes(q)
    );
  });

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

  // ==============================|| TABLE COLUMNS ||============================== //
  const columns = [
    {
      field: 'projectId',
      headerName: 'Project ID',
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Typography variant="caption" color="primary" fontWeight={600}>
          {params.row.projectId}
        </Typography>
      )
    },
    {
      field: 'title',
      headerName: 'Project Title',
      flex: 1.5,
      minWidth: 100,
      renderCell: (params) => (
        <Box>
          <Typography variant="caption">{params.row.title}</Typography>
          {/* <Typography variant="caption" color="textSecondary">
                {params.row.shortDescription?.slice(0, 50)}...
              </Typography> */}
        </Box>
      )
    },
    {
      field: 'description',
      headerName: 'Project Description',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="caption" color="textSecondary">
            {params.row.shortDescription?.slice(0, 50)}...
          </Typography>
        </Box>
      )
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} sx={{ pt: 1, pb: 2 }} alignItems="center">
          <Avatar sx={{ width: 32, height: 32 }}>{params.row.createdBy?.name?.charAt(0) || 'A'}</Avatar>
          <Typography variant="subtitle2">{params.row.createdBy?.name || 'N/A'}</Typography>
        </Stack>
      )
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => {
        // ✅ Convert single or multiple managers into array
        const managers = Array.isArray(params.row.manager) ? params.row.manager : params.row.manager ? [params.row.manager] : [];

        return (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              width: '100%',
              height: '100%',
              py: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            {managers.length > 0 ? (
              <>
                {managers.slice(0, 2).map((manager) => (
                  <Chip key={manager._id} label={manager.name} size="small" color="primary" variant="outlined" sx={{ maxWidth: '100%' }} />
                ))}
                {managers.length > 2 && <Chip label={`+${managers.length - 2}`} size="small" sx={{ fontWeight: 600 }} />}
              </>
            ) : (
              <Chip label="Not Assigned" size="small" variant="outlined" color="default" />
            )}
          </Stack>
        );
      }
    },
    {
      field: 'analysts',
      headerName: 'Analysts',
      flex: 1.3,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => {
        const analysts = params.row.analysts || [];

        return (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              width: '100%',
              height: '100%',
              py: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            {analysts.length > 0 ? (
              <>
                {analysts.slice(0, 2).map((analyst) => (
                  <Chip key={analyst._id} label={analyst.name} size="small" color="primary" variant="outlined" sx={{ maxWidth: '100%' }} />
                ))}
                {analysts.length > 2 && <Chip label={`+${analysts.length - 2}`} size="small" sx={{ fontWeight: 600 }} />}
              </>
            ) : (
              <Chip label="No Analysts" size="small" variant="outlined" color="default" />
            )}
          </Stack>
        );
      }
    },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ width: '100%', pt: 1, pb: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.row.progress || 0}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={params.row.progress || 0}
            color={getProgressColor(params.row.progress || 0)}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => {
        const status = params.row.status || 'Active';

        const statusColor = {
          Active: 'success',
          'In Progress': 'warning',
          Completed: 'info',
          'On Hold': 'default'
        };

        return <Chip label={status} color={statusColor[status] || 'default'} size="small" />;
      }
    },
    {
      field: 'versions',
      headerName: 'Versions',
      flex: 1.2,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        const versions = params.row.versions || [];

        return (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              width: '100%',
              height: '100%',
              py: 1,
              flexWrap: 'wrap'
            }}
          >
            {/* Version Chips */}
            {versions.length > 0 ? (
              <>
                {versions.slice(0, 2).map((version) => (
                  <Chip
                    key={version._id}
                    label={`v${version.version}`}
                    size="small"
                    color={version.status === 'published' ? 'success' : version.status === 'archived' ? 'default' : 'primary'}
                    variant="outlined"
                  />
                ))}

                {versions.length > 2 && <Chip label={`+${versions.length - 2}`} size="small" sx={{ fontWeight: 600 }} />}
              </>
            ) : null}

            {/* View Button */}
            <Tooltip title="View All Versions">
              <IconButton
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/projects/${params.row._id}/versions`);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    },
    // ==============================|| ACTION COLUMN ||============================== //
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 180,
      renderCell: (params) => {
        const user = JSON.parse(localStorage.getItem('user'));

        return (
          <Stack direction="row" sx={{ pt: 1, pb: 2 }}>
            {/* View */}
            <Tooltip title="View">
              <IconButton color="primary" onClick={() => handleView(params.row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            {/* Edit */}
            <Tooltip title="Edit">
              <IconButton color="secondary" onClick={() => handleOpenEdit(params.row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            {/* Delete - Only Admin */}
            {user?.role?.toLowerCase() === 'admin' && (
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => handleDeleteProject(params.row._id, params.row.title)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      }
    }
  ];

  return (
    <MainCard>
      {/* HEADER */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h3">Projects Management</Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/projects/add')}>
          Add New Project
        </Button>
      </Stack>

      {/* SEARCH */}
      <TextField
        fullWidth
        placeholder="Search by Project ID, Title, or Creator..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />

      {/* TABLE */}
      <Box sx={{ height: 650 }}>
        <DataGrid
          rows={filteredProjects}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 }
            }
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* ================= VIEW MODAL ================= */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="lg"
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {/* ================= HEADER ================= */}
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: '#fff',
            py: 3
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" color="white">
                Project Details
              </Typography>
              <Typography variant="body2" color="white">
                Complete project overview, team assignment and workflow
              </Typography>
            </Box>

            <IconButton onClick={() => setViewOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        {/* ================= CONTENT ================= */}
        <DialogContent dividers sx={{ p: 4 }}>
          {!viewProject ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* ================= BASIC DETAILS ================= */}
              <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Basic Project Details
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h3" fontWeight={700}>
                        {getSafeValue(viewProject.title)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography color="text.secondary">{getSafeValue(viewProject.shortDescription)}</Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Project ID</Typography>
                      <Chip icon={<AssignmentIcon />} label={getSafeValue(viewProject.projectId)} />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Priority</Typography>
                      <Chip label={getSafeValue(viewProject.priority)} color="secondary" />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Status</Typography>
                      <Chip
                        label={getSafeValue(viewProject.status)}
                        color={
                          viewProject.status === 'Completed'
                            ? 'info'
                            : viewProject.status === 'In Progress'
                              ? 'warning'
                              : viewProject.status === 'On Hold'
                                ? 'default'
                                : 'success'
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Typography variant="subtitle2">Due Date</Typography>
                      <Typography>
                        <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        {formatDate(viewProject.dueDate)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Progress
                      </Typography>
                      <LinearProgress variant="determinate" value={viewProject.progress || 0} sx={{ height: 10, borderRadius: 5 }} />
                      <Typography mt={1}>{viewProject.progress || 0}% Completed</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* ================= TEAM ASSIGNMENT ================= */}
              <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Team Assignment
                  </Typography>

                  <Grid container spacing={4}>
                    {/* Managers */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Project Owners / Managers
                      </Typography>

                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {viewProject.managers?.length ? (
                          viewProject.managers.map((manager) => (
                            <Chip key={manager._id} label={manager.name || manager.email} color="primary" variant="outlined" />
                          ))
                        ) : (
                          <Typography color="text.secondary">No managers assigned</Typography>
                        )}
                      </Stack>
                    </Grid>

                    {/* Analysts */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        <GroupsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Assigned Analysts
                      </Typography>

                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {viewProject.analysts?.length ? (
                          viewProject.analysts.map((analyst) => (
                            <Chip key={analyst._id} label={analyst.name || analyst.email} color="secondary" variant="outlined" />
                          ))
                        ) : (
                          <Typography color="text.secondary">No analysts assigned</Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* ================= SCIENTIFIC WORKFLOW ================= */}
              <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Scientific Workflow
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    NGS Applications
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {viewProject.ngsApplications?.length ? (
                      viewProject.ngsApplications.map((app, index) => (
                        <Chip key={index} label={app.label || app.value || app} color="success" variant="outlined" />
                      ))
                    ) : (
                      <Typography color="text.secondary">No NGS applications selected</Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* ================= FOOTER ACTION ================= */}
              <Divider sx={{ my: 3 }} />

              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={() => setViewOpen(false)}>
                  Close
                </Button>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= EDIT MODAL ================= */}
      <Dialog
        open={editOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="lg"
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {/* ================= HEADER ================= */}
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #5e35b1, #7c4dff)',
            color: '#fff',
            py: 3
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" color="white">
                Edit Project
              </Typography>
              <Typography variant="body2" color="white">
                Update project details, owners, analysts and scientific workflow
              </Typography>
            </Box>

            <IconButton onClick={handleCloseEdit} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        {/* ================= CONTENT ================= */}
        <DialogContent dividers sx={{ p: 4 }}>
          <Box>
            {/* BASIC DETAILS */}
            <Card sx={{ mb: 4, borderRadius: 4, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Basic Project Details
                </Typography>

                <Grid container spacing={3}>
                  {/* Title */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Project Title"
                      name="title"
                      value={form.title || ''}
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

                  {/* Priority */}
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth select label="Priority" name="priority" value={form.priority || 'Medium'} onChange={handleChange}>
                      <MenuItem value="Low">Low</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Critical">Critical</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth select label="Status" name="status" value={form.status || 'Active'} onChange={handleChange}>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="On Hold">On Hold</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Due Date */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Due Date"
                      name="dueDate"
                      value={form.dueDate || ''}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Progress */}
                  <Grid item xs={12}>
                    {/* <Typography gutterBottom>Progress: {form.progress || 0}%</Typography> */}

                    <TextField
                      fullWidth
                      type="number"
                      label="Progress %"
                      name="progress"
                      value={form.progress || 0}
                      onChange={handleChange}
                      inputProps={{
                        min: 0,
                        max: 100
                      }}
                    />
                  </Grid>

                  {/* Description */}
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Short Description"
                    name="shortDescription"
                    value={form.shortDescription || ''}
                    onChange={handleChange}
                  />
                </Grid>
              </CardContent>
            </Card>

            {/* ================= TEAM ASSIGNMENT ================= */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 4,
                boxShadow: 3,
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 4, overflow: 'visible' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Team Assignment
                </Typography>

                <Grid container spacing={4}>
                  {/* Project Owners / Managers */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon sx={{ mr: 1 }} />
                      Project Owners / Managers
                    </Typography>

                    <Box sx={{ position: 'relative', zIndex: 9999 }}>
                      <CreatableSelect
                        isMulti
                        options={managers}
                        styles={selectStyles}
                        value={form.managers}
                        isLoading={loadingUsers}
                        onChange={(selected) => handleSelectChange('managers', selected)}
                        placeholder="Search managers or add new user"
                      />
                    </Box>
                  </Grid>

                  {/* Analysts */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon sx={{ mr: 1 }} />
                      Assigned Analysts
                    </Typography>

                    <Box sx={{ position: 'relative', zIndex: 9999 }}>
                      <CreatableSelect
                        isMulti
                        options={analysts}
                        value={form.analysts}
                        styles={selectStyles}
                        isLoading={loadingUsers}
                        onChange={(selected) => handleSelectChange('analysts', selected)}
                        placeholder="Select analysts or add new user"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ================= NGS APPLICATIONS ================= */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 4,
                boxShadow: 3,
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 4, overflow: 'visible' }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Scientific Workflow
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <ScienceIcon sx={{ mr: 1 }} />
                      NGS Applications
                    </Typography>

                    <Box sx={{ position: 'relative', zIndex: 9999 }}>
                      <CreatableSelect
                        isMulti
                        isSearchable
                        options={ngsOptions || []}
                        value={form.ngsApplications || []}
                        styles={{
                          ...selectStyles,
                          container: (base) => ({
                            ...base,
                            width: '100%'
                          }),
                          control: (base) => ({
                            ...base,
                            minHeight: 55,
                            borderRadius: 12,
                            paddingLeft: 4,
                            borderColor: '#d0d7de',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: theme.palette.secondary.main
                            }
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            padding: '8px 12px'
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            borderRadius: 12
                          })
                        }}
                        menuPortalTarget={document.body}
                        onChange={(selected) =>
                          setForm((prev) => ({
                            ...prev,
                            ngsApplications: selected || []
                          }))
                        }
                        placeholder="Search, select or create custom applications..."
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Divider sx={{ my: 4 }} />

            {/* ACTIONS */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" color="inherit" onClick={handleCloseEdit}>
                Cancel
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                disabled={submitting}
                onClick={handleSave}
              >
                {submitting ? 'Updating...' : 'Update Project'}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </MainCard>
  );
}
