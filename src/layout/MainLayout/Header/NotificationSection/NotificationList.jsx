import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: withAlpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList() {
  const containerSX = { gap: 2, pl: 7 };

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar alt="John Doe" src={User1} />
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">John Doe</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">It is a long established fact that a reader will be distracted</Typography>
          <Chip label="Confirmation of Account." color="success" size="small" sx={{ width: 'min-content' }} />
        </Stack>
      </ListItemWrapper>
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
