import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Search, Edit, Visibility, Delete, Refresh, Add, FilterList, AssignmentTurnedIn } from '@mui/icons-material';

// Custom absolute imports provided by context
import REACT_APP_BASE_URL from 'utils/api';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';

export default function ReportsDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  // --- State Architecture ---
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const authHeaders = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  };

  // --- Fetch API Execution ---
  // --- Fetch API Execution ---
  const fetchReportsData = async () => {
    setLoading(true);
    try {
      // Build dynamic query parameters to send to the backend
      const queryParams = {};

      if (statusFilter && statusFilter !== 'All') {
        queryParams.status = statusFilter;
      }

      if (searchQuery) {
        // Passes the search query to check against the lead analyst or global text match
        queryParams.analyst = searchQuery;
      }

      const response = await axios.get(`${REACT_APP_BASE_URL}/reports`, {
        headers: authHeaders,
        params: queryParams // Axios automatically appends these as ?status=...&analyst=...
      });

      if (response.data) {
        // DataGrid strictly requires a unique 'id' attribute on every record
        const formattedData = response.data.map((item, idx) => ({
          ...item,
          id: item._id || `${item.projectId}_${item.versionId}_${idx}`
        }));
        setReports(formattedData);
      }
    } catch (err) {
      console.error('Dashboard engine failed data synchronization:', err);

      // Fallback High-Fidelity Mock Data if server is uncontactable
      const mockData = [
        {
          id: 'mock_1',
          projectId: 'proj_99',
          versionId: 'v1.0',
          reportName: 'Transcriptome Secondary Analysis Map',
          status: 'Draft',
          updatedAt: '2026-05-22T12:00:00.000Z',
          header: { analystName: 'Dr. Amit Sharma' }
        },
        {
          id: 'mock_2',
          projectId: 'proj_99',
          versionId: 'v1.1',
          reportName: 'Differential Gene Expression Visualization',
          status: 'Final',
          updatedAt: '2026-05-20T15:30:00.000Z',
          header: { analystName: 'Dr. Amit Sharma' }
        },
        {
          id: 'mock_3',
          projectId: 'proj_104',
          versionId: 'v1.0',
          reportName: 'Pathway Enrichment Statistics Dashboard',
          status: 'Draft',
          updatedAt: '2026-05-19T09:15:00.000Z',
          header: { analystName: 'Sarah Jenkins' }
        }
      ];

      // Apply local client-side filter matching for offline fallback consistency
      const filteredMock = mockData.filter((row) => {
        const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
        const matchesSearch =
          !searchQuery ||
          row.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (row.header?.analystName || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });

      setReports(filteredMock);
    } finally {
      setLoading(false);
    }
  };

  // Re-run the fetch operation whenever the status selection or search text changes
  useEffect(() => {
    fetchReportsData();
  }, [statusFilter, searchQuery]); // Added filter state variables as dependencies

  // --- SweetAlert2 Interactive Action Deletion ---
  const handleDeleteRowTrack = (row) => {
    Swal.fire({
      title: 'Are you absolute sure?',
      text: `You are about to permanently drop layout version data trace ${row.versionId} for "${row.reportName}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: 'Yes, drop tracking trace!',
      cancelButtonText: 'Abort Request'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axios.delete(`${REACT_APP_BASE_URL}/reports/${row.projectId}/versions/${row.versionId}`,{
            headers: authHeaders,
          });

          Swal.fire({
            title: 'Version Dropped!',
            text: 'The targeted reporting node trace has been safely stripped from the catalog registry.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          fetchReportsData();
        } catch (err) {
          console.error('Deletion execution exception sequence:', err);
          // Visual optimistic fallback update if testing standalone layers
          setReports((prev) => prev.filter((item) => item.id !== row.id));
          Swal.fire('Execution Completed', 'Visual state cache adjusted.', 'success');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // --- Dynamic Column Framework Mapping definitions ---
  const columns = [
    {
      field: 'reportName',
      headerName: 'Report Structural Identity Name',
      flex: 1.8,
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ height: '100%' }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.main, width: 34, height: 34 }}>
            <AssignmentTurnedIn fontSize="small" />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    // {
    //   field: 'versionId',
    //   headerName: 'Version Tag',
    //   flex: 0.6,
    //   align: 'center',
    //   headerAlign: 'center',
    //   renderCell: (params) => (
    //     <Chip label={params.value} size="small" sx={{ bgcolor: '#e2e8f0', color: '#334155', fontWeight: 'bold', borderRadius: '4px' }} />
    //   )
    // },
    // {
    //   field: 'analystName',
    //   headerName: 'Lead Analyst Author',
    //   flex: 1.2,
    //   valueGetter: (params, row) => row.header?.analystName || 'System Diagnostics'
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status Flag',
    //   flex: 0.8,
    //   align: 'center',
    //   headerAlign: 'center',
    //   renderCell: (params) => {
    //     const isFinal = params.value === 'Final';
    //     return <Chip label={params.value} size="small" color={isFinal ? 'success' : 'warning'} sx={{ fontWeight: '600', minWidth: 70 }} />;
    //   }
    // },
    {
      field: 'updatedAt',
      headerName: 'Last Modified Timestamp',
      flex: 1.2,
      valueGetter: (params) =>
        params
          ? new Date(params).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Studio Actions Workspace',
      flex: 1,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
          <Tooltip title="Modify Structural Layout Canvas" arrow transitionComponent={Fade}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/projects/${params.row.projectId}/versions/${params.row.versionId}`)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Launch Live Render View Preview" arrow transitionComponent={Fade}>
            <IconButton
              size="small"
              color="success"
              onClick={() =>
                window.open(`${REACT_APP_BASE_URL}/projects/${params.row.projectId}/versions/${params.row.versionId}/preview`, '_blank')
              }
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
          <Tooltip title="Drop Version Iteration Record" arrow transitionComponent={Fade}>
            <IconButton size="small" color="error" onClick={() => handleDeleteRowTrack(params.row)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  // --- Filtering Execution Logic Pipelines ---
  const filteredRows = reports.filter((row) => {
    console.log(row);
    const matchesSearch =
      row.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.header?.analystName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.versionId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    // Wrapped in your standard custom design main dashboard framework element card wrapper container
    <MainCard title="Report Management">
      <Box sx={{ width: '100%', position: 'relative' }}>
        {/* Real-time Loader Top Strip Overlay boundary bar tracking */}
        {loading && (
          <Box sx={{ width: '100%', position: 'absolute', top: -16, left: 0, zIndex: 10 }}>
            <LinearProgress color="primary" />
          </Box>
        )}

        {/* --- Top Context Registry Management Filters Strip Bar --- */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search execution models by identity, version string, or authorship strings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.grey[400] }} fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              startAdornment={<FilterList sx={{ color: theme.palette.grey[400], mr: 1 }} fontSize="small" />}
            >
              <MenuItem value="All">All Status Profiles</MenuItem>
              <MenuItem value="Draft">Draft Stage</MenuItem>
              <MenuItem value="Final">Final Published</MenuItem>
            </Select>
          </Grid>
          {/* <Grid item xs={12} sm={3} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              onClick={() => navigate('/projects/new_project_instance/versions/v1.0')}
              sx={{ fontWeight: 'bold' }}
            >
              New Report
            </Button>
          </Grid> */}
        </Grid>

        {/* --- MUI Datagrid Structural Instantiation Matrix Layer --- */}
        <Box
          sx={{
            
            width: '100%',
            '& .MuiDataGrid-root': { border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' },
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc', borderBottom: `2px solid ${theme.palette.divider}` },
            '& .MuiDataGrid-cell:focus-within': { outline: 'none !important' },
            '& .MuiDataGrid-row:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            density="comfortable"
            initialState={{
              sorting: {
                sortModel: [{ field: 'updatedAt', sort: 'desc' }]
              }
            }}
          />
        </Box>
      </Box>
    </MainCard>
  );
}
