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

const getProgressColor = (progress) => {
  if (progress < 30) return 'error';
  if (progress < 70) return 'warning';
  return 'success';
};
export default function ProjectsListPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [managers, setManagers] = useState([]);
  const [analysts, setAnalysts] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };
  // ==============================|| FETCH PROJECTS ||============================== //
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem('user'));

      const res = await axios.get(`${REACT_APP_BASE_URL}/projects`, {
        headers: authHeaders
      });

      const allProjects = res.data || [];

      console.log(allProjects);

      let filteredProjects = allProjects;

      if (user?.role?.toLowerCase() === 'manager') {
        // Show only projects assigned to this manager
        filteredProjects = allProjects.filter((project) => {
          if (Array.isArray(project.manager)) {
            return project.manager.some((manager) => manager?._id === user._id);
          }

          return project.manager?._id === user._id;
        });
      } else if (user?.role?.toLowerCase() === 'analyst') {
        // Show only projects assigned to this analyst
        filteredProjects = allProjects.filter((project) => project.analysts?.some((analyst) => analyst?._id === user._id));
      } else if (user?.role?.toLowerCase() === 'client') {
        filteredProjects = allProjects.filter((project) => {
          const isAssignedClient = project.clients?.some((client) => client?._id === user._id);

          const hasPublishedVersion = project.versions?.some((version) =>
            ['approved for client review', 'published'].includes(version?.status?.toLowerCase())
          );
          return isAssignedClient && hasPublishedVersion;
        });
      } else if (user?.role?.toLowerCase() === 'admin') {
        // Admin sees all projects
        filteredProjects = allProjects;
      } else {
        filteredProjects = [];
      }

      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================|| VIEW PROJECT ||============================== //
  const handleView = (project) => {
    setViewProject(project);
    setViewOpen(true);
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
      minWidth: 140,
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
    // {
    //   field: 'createdBy',
    //   headerName: 'Created By',
    //   flex: 1,
    //   minWidth: 180,
    //   renderCell: (params) => (
    //     <Stack direction="row" spacing={1} sx={{ pt: 1, pb: 2 }} alignItems="center">
    //       <Avatar sx={{ width: 32, height: 32 }}>{params.row.createdBy?.name?.charAt(0) || 'A'}</Avatar>
    //       <Typography variant="subtitle2">{params.row.createdBy?.name || 'N/A'}</Typography>
    //     </Stack>
    //   )
    // },
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
    // {
    //   field: 'analysts',
    //   headerName: 'Analysts',
    //   flex: 1.3,
    //   minWidth: 180,
    //   sortable: false,
    //   renderCell: (params) => {
    //     const analysts = params.row.analysts || [];

    //     return (
    //       <Stack
    //         direction="row"
    //         spacing={0.5}
    //         sx={{
    //           width: '100%',
    //           height: '100%',
    //           py: 1,
    //           flexWrap: 'wrap',
    //           alignItems: 'center',
    //           overflow: 'hidden'
    //         }}
    //       >
    //         {analysts.length > 0 ? (
    //           <>
    //             {analysts.slice(0, 2).map((analyst) => (
    //               <Chip key={analyst._id} label={analyst.name} size="small" color="primary" variant="outlined" sx={{ maxWidth: '100%' }} />
    //             ))}
    //             {analysts.length > 2 && <Chip label={`+${analysts.length - 2}`} size="small" sx={{ fontWeight: 600 }} />}
    //           </>
    //         ) : (
    //           <Chip label="No Analysts" size="small" variant="outlined" color="default" />
    //         )}
    //       </Stack>
    //     );
    //   }
    // },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 1,
      minWidth: 120,
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
      minWidth: 120,
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
      minWidth: 140,
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
          </Stack>
        );
      }
    },

    // ==============================|| ACTION COLUMN ||============================== //
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 100,
      renderCell: (params) => {
        const user = JSON.parse(localStorage.getItem('user'));

        return (
          <Stack direction="row" sx={{ pt: 1, pb: 2 }}>
            {/* View */}
            {/* <Tooltip title="View">
              <IconButton color="primary" onClick={() => handleView(params.row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip> */}

            {/* Edit */}
            {/* <Tooltip title="Edit">
              <IconButton color="secondary" onClick={() => handleOpenEdit(params.row)}>
                <EditIcon />
              </IconButton>
            </Tooltip> */}

            {/* Delete - Only Admin */}
            {/* {user?.role?.toLowerCase() === 'admin' && (
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => handleDeleteProject(params.row._id, params.row.title)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )} */}

            {/* View Button */}
            <Tooltip title="View All Versions">
              <IconButton
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/client/projects/${params.row._id}/versions`);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  return (
    <MainCard>
      {/* HEADER */}

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
      <Box>
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
    </MainCard>
  );
}
