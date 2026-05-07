import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// assets
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

import MainCard from 'ui-component/cards/MainCard';
import REACT_APP_BASE_URL from 'utils/api';

const getProgressColor = (progress) => {
  if (progress < 30) return 'error';
  if (progress < 70) return 'warning';
  return 'success';
};

export default function ProjectsListPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${REACT_APP_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const q = search.toLowerCase();
    return (
      project.title?.toLowerCase().includes(q) ||
      project.projectId?.toLowerCase().includes(q) ||
      project.createdBy?.name?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      field: 'projectId',
      headerName: 'Project ID',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="subtitle2" color="secondary">
          {params.row.projectId}
        </Typography>
      )
    },
    {
      field: 'title',
      headerName: 'Project Title',
      flex: 1.5,
      minWidth: 220,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2">{params.row.title}</Typography>
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
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 32, height: 32 }}>{params.row.createdBy?.name?.charAt(0) || 'A'}</Avatar>
          <Typography variant="body2">{params.row.createdBy?.name || 'N/A'}</Typography>
        </Stack>
      )
    },
    {
      field: 'manager',
      headerName: 'Manager',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => <Typography variant="body2">{params.row.manager?.name || 'Not Assigned'}</Typography>
    },
    {
      field: 'clients',
      headerName: 'Clients',
      flex: 1.3,
      minWidth: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap">
          {params.row.clients?.slice(0, 2).map((client) => (
            <Chip key={client._id} label={client.name} size="small" color="primary" variant="outlined" />
          ))}
          {params.row.clients?.length > 2 && <Chip label={`+${params.row.clients.length - 2}`} size="small" />}
        </Stack>
      )
    },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
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
      minWidth: 140,
      renderCell: (params) => (
        <Chip label={params.row.status || 'Active'} color={params.row.status === 'Completed' ? 'success' : 'info'} size="small" />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 130,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Project">
            <IconButton color="primary" onClick={() => navigate(`/projects/${params.row._id}`)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Project">
            <IconButton color="secondary" onClick={() => navigate(`/projects/edit/${params.row._id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <MainCard container spacing={3}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h3">Projects Management</Typography>
          {/* <Typography variant="body2" color="textSecondary">
                  Manage projects, assignments, clients and progress
                </Typography> */}
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} color="primary" onClick={() => navigate('/admin/projects/add')}>
          Add New Project
        </Button>
      </Stack>

      {/* Search */}
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

      {/* Table */}
      <Box sx={{ height: 650, width: '100%' }}>
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
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              fontSize: '14px',
              fontWeight: 700
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb'
            }
          }}
        />
      </Box>
    </MainCard>
  );
}
