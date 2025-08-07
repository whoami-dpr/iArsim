import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Slider,
  TextField,
  Switch as MuiSwitch,
  FormGroup,
  FormControlLabel as MuiFormControlLabel,
  Box as MuiBox,
  Divider as MuiDivider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const sidebarOptions = [
  'General',
  'Standings',
  'Relative',
  'Fuel calculator',
  'Spotter',
  'Pit helper',
  'Inputs',
  'Inputs graph',
  'Traffic indicator',
  'Flatmap',
  'Delta bar',
  'Trackmap',
  'Twitch chat',
];

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    background: {
      default: mode === 'dark' ? '#181c20' : '#f4f6fa',
      paper: mode === 'dark' ? '#23272f' : '#fff',
    },
    primary: {
      main: mode === 'dark' ? '#fff' : '#232a34',
    },
    secondary: {
      main: '#00bfff',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#232a34',
      secondary: mode === 'dark' ? '#b0b8c1' : '#6b7684',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 0.5,
    },
    overline: {
      fontWeight: 700,
      fontSize: '0.8rem',
      letterSpacing: 2,
      color: mode === 'dark' ? '#b0b8c1' : '#6b7684',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'dark' ? '#181c20' : '#f4f6fa',
          borderRight: 'none',
          boxShadow: mode === 'dark' ? '2px 0 12px 0 #0004' : '2px 0 12px 0 #b0b8c122',
        },
      },
    },
  },
});

const drawerWidth = 260;

const defaultRelativeConfig = {
  overlaySize: 14,
  useGeneralSize: true,
  opacity: 75,
  useGeneralOpacity: true,
  showInCar: true,
  showOutCar: true,
  showSpotting: true,
  showGarage: true,
  driversAheadBehind: 4,
  highlightSelected: false,
  showPositionChanges: false,
  forceSameWidth: false,
  showColumnNames: false,
  hideCarsInPit: false,
  showFlags: false,
  // Content columns
  showPosition: true,
  showCarNumber: true,
  showDriverName: true,
  showTeamName: false,
  showIRating: false,
  showLicense: false,
  showCarClass: true,
  showCarModel: false,
  showCarColor: false,
  showDeltaToYou: true,
  showDeltaToLeader: false,
  showDeltaToNext: false,
  showDeltaToPrevious: false,
  showLapsCompleted: false,
  showLapsToGo: false,
  showLapsSincePit: false,
  showLastLapTime: true,
  showBestLapTime: false,
  showPitStatus: false,
  showInPitLane: false,
  showOnPitRoad: false,
  showFuelLevel: false,
  showFuelPerLap: false,
  showFuelToFinish: false,
  showIncidentCount: false,
  showRelativeSpeed: false,
  showLivePositionChange: false,
  showFastestLapIndicator: false,
  showCurrentFlag: false,
  showCarStatus: false,
  showCustomField: false,
  // Header options
  showOverlayTitle: true,
  showTrackName: true,
  showSessionType: true,
  showLapCounter: true,
  showTimeRemaining: true,
  showWeatherInfo: false,
  showCarClassFilter: false,
  showHighlightOwnCar: true,
  showCarNumberHeader: false,
  // Footer options
  showBestLapOverall: false,
  showBestLapOwn: true,
  showLastLapOwn: true,
  showIncidentCountOwn: false,
  showPitInfoOwn: false,
  showCustomMessage: false,
  showLegend: false,
  showTimeOfDay: false,
  showSessionState: false,
  showGapToLeader: false,
  showGapToNextPrev: false,
};

function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

interface RelativeConfigPanelProps { mode: 'light' | 'dark'; }
const RelativeConfigPanel: React.FC<RelativeConfigPanelProps> = ({ mode }) => {
  const [tab, setTab] = React.useState<number>(0);
  const [config, setConfig] = useLocalStorageState<typeof defaultRelativeConfig>('relativeConfig', defaultRelativeConfig);
  const [visible, setVisible] = React.useState(() => {
    const stored = localStorage.getItem('relativeVisible');
    return stored ? JSON.parse(stored) : true;
  });
  React.useEffect(() => {
    localStorage.setItem('relativeVisible', JSON.stringify(visible));
  }, [visible]);

  // Handler para switches
  const handleSwitch = (field: keyof typeof defaultRelativeConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({
      ...config,
      [field]: event.target.checked,
    });
  };

  // Handler para inputs numéricos/texto
  const handleInput = (field: keyof typeof defaultRelativeConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'number' ? Number(event.target.value) : event.target.value;
    setConfig({
      ...config,
      [field]: value,
    });
  };

  return (
    <MuiBox
      sx={{
        width: '100%',
        maxWidth: 900,
        px: { xs: 1, sm: 3 },
        pt: 0,
        mt: 0,
        minWidth: 0,
        overflowX: 'auto',
        alignSelf: 'stretch',
        bgcolor: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, flexGrow: 1 }}>
          Relative
        </Typography>
        <FormControlLabel
          control={<Switch checked={visible} onChange={e => setVisible(e.target.checked)} color="primary" />}
          label="Visible"
          sx={{ ml: 2 }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        The relative overlay show the other drivers around you.
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          '.MuiTab-root': {
            fontWeight: 500,
            minHeight: 36,
            minWidth: 90,
            borderRadius: 0,
            background: 'none',
            px: 3,
            py: 0,
            transition: 'background 0.2s',
            position: 'relative',
            zIndex: 1,
          },
          '.Mui-selected': {
            color: '#232a34',
            background: 'none',
            fontWeight: 700,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '100%',
              pointerEvents: 'none',
              borderRadius: 0,
              background: 'linear-gradient(to top, #2196f3aa 1%, transparent 89%)',
              zIndex: -1,
            },
          },
          '.MuiTabs-indicator': {
            backgroundColor: '#2196f3',
            height: 5,
            borderRadius: 0,
            bottom: 0,
            marginBottom: '-2px',
          },
        }}
      >
        <Tab label="General" sx={{ minWidth: 90 }} />
        <Tab label="Content" sx={{ minWidth: 90 }} />
        <Tab label="Header" sx={{ minWidth: 90 }} />
        <Tab label="Footer" sx={{ minWidth: 90 }} />
      </Tabs>
      <MuiDivider sx={{ my: 2 }} />
      {tab === 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Size and visibility</Typography>
          <MuiBox sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Overlay size"
              type="number"
              size="small"
              value={config.overlaySize}
              onChange={handleInput('overlaySize')}
              sx={{ width: { xs: 80, sm: 80 }, flex: '1 1 80px', minWidth: 0 }}
              inputProps={{ min: 8, max: 40 }}
            />
            <MuiFormControlLabel
              control={<MuiSwitch checked={config.useGeneralSize} onChange={handleSwitch('useGeneralSize')} />}
              label="Use general"
              sx={{ flex: '1 1 120px', minWidth: 0 }}
            />
            <TextField
              label="Opacity"
              type="number"
              size="small"
              value={config.opacity}
              onChange={handleInput('opacity')}
              sx={{ width: { xs: 80, sm: 80 }, flex: '1 1 80px', minWidth: 0 }}
              inputProps={{ min: 10, max: 100 }}
            />
            <MuiFormControlLabel
              control={<MuiSwitch checked={config.useGeneralOpacity} onChange={handleSwitch('useGeneralOpacity')} />}
              label="Use general"
              sx={{ flex: '1 1 120px', minWidth: 0 }}
            />
          </MuiBox>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Show overlay when</Typography>
          <FormGroup row sx={{ mb: 2, flexWrap: 'wrap' }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showInCar} onChange={handleSwitch('showInCar')} />} label="In car" sx={{ flex: '1 1 120px', minWidth: 0 }} />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showOutCar} onChange={handleSwitch('showOutCar')} />} label="Out of car" sx={{ flex: '1 1 140px', minWidth: 0 }} />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showSpotting} onChange={handleSwitch('showSpotting')} />} label="Spotting" sx={{ flex: '1 1 120px', minWidth: 0 }} />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showGarage} onChange={handleSwitch('showGarage')} />} label="In garage" sx={{ flex: '1 1 120px', minWidth: 0 }} />
          </FormGroup>
          <MuiDivider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Overlay specific</Typography>
          <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Drivers ahead/behind"
              type="number"
              size="small"
              value={config.driversAheadBehind}
              onChange={handleInput('driversAheadBehind')}
              sx={{ width: { xs: 80, sm: 80 }, flex: '1 1 80px', minWidth: 0 }}
              inputProps={{ min: 1, max: 20 }}
            />
          </MuiBox>
          <FormGroup sx={{ flexDirection: 'column', gap: 1, flexWrap: 'nowrap', mt: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.highlightSelected} onChange={handleSwitch('highlightSelected')} />} label="Highlight background color for selected driver" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showPositionChanges} onChange={handleSwitch('showPositionChanges')} />} label="Show live position changes" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.forceSameWidth} onChange={handleSwitch('forceSameWidth')} />} label="Force same window width for all sessions" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showColumnNames} onChange={handleSwitch('showColumnNames')} />} label="Show column names" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.hideCarsInPit} onChange={handleSwitch('hideCarsInPit')} />} label="Hide cars in pit box" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showFlags} onChange={handleSwitch('showFlags')} />} label="Show flags" />
          </FormGroup>
        </>
      )}
      {tab === 1 && (
        <MuiBox sx={{ p: 2, color: 'text.secondary' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Content columns</Typography>
          <FormGroup sx={{ flexDirection: 'column', gap: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showPosition} onChange={handleSwitch('showPosition')} />} label="Position" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarNumber} onChange={handleSwitch('showCarNumber')} />} label="Car number" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showDriverName} onChange={handleSwitch('showDriverName')} />} label="Driver name" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTeamName} onChange={handleSwitch('showTeamName')} />} label="Team name" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showIRating} onChange={handleSwitch('showIRating')} />} label="iRating" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLicense} onChange={handleSwitch('showLicense')} />} label="License" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarClass} onChange={handleSwitch('showCarClass')} />} label="Car class" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarModel} onChange={handleSwitch('showCarModel')} />} label="Car model" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarColor} onChange={handleSwitch('showCarColor')} />} label="Car color/class color" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showDeltaToYou} onChange={handleSwitch('showDeltaToYou')} />} label="Delta to you" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showDeltaToLeader} onChange={handleSwitch('showDeltaToLeader')} />} label="Delta to leader" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showDeltaToNext} onChange={handleSwitch('showDeltaToNext')} />} label="Delta to next" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showDeltaToPrevious} onChange={handleSwitch('showDeltaToPrevious')} />} label="Delta to previous" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLapsCompleted} onChange={handleSwitch('showLapsCompleted')} />} label="Laps completed" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLapsToGo} onChange={handleSwitch('showLapsToGo')} />} label="Laps to go" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLapsSincePit} onChange={handleSwitch('showLapsSincePit')} />} label="Laps since pit" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLastLapTime} onChange={handleSwitch('showLastLapTime')} />} label="Last lap time" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showBestLapTime} onChange={handleSwitch('showBestLapTime')} />} label="Best lap time" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showPitStatus} onChange={handleSwitch('showPitStatus')} />} label="Pit status" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showInPitLane} onChange={handleSwitch('showInPitLane')} />} label="In pit lane" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showOnPitRoad} onChange={handleSwitch('showOnPitRoad')} />} label="On pit road" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showFuelLevel} onChange={handleSwitch('showFuelLevel')} />} label="Fuel level" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showFuelPerLap} onChange={handleSwitch('showFuelPerLap')} />} label="Fuel per lap" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showFuelToFinish} onChange={handleSwitch('showFuelToFinish')} />} label="Fuel to finish" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showIncidentCount} onChange={handleSwitch('showIncidentCount')} />} label="Incident count" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showRelativeSpeed} onChange={handleSwitch('showRelativeSpeed')} />} label="Relative speed" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLivePositionChange} onChange={handleSwitch('showLivePositionChange')} />} label="Position change (live)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showFastestLapIndicator} onChange={handleSwitch('showFastestLapIndicator')} />} label="Fastest lap indicator" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCurrentFlag} onChange={handleSwitch('showCurrentFlag')} />} label="Flag (current)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarStatus} onChange={handleSwitch('showCarStatus')} />} label="Car status (running, out, DQ, etc.)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCustomField} onChange={handleSwitch('showCustomField')} />} label="Custom field" />
          </FormGroup>
        </MuiBox>
      )}
      {tab === 2 && (
        <MuiBox sx={{ p: 2, color: 'text.secondary' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Header options</Typography>
          <FormGroup sx={{ flexDirection: 'column', gap: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showOverlayTitle} onChange={handleSwitch('showOverlayTitle')} />} label="Overlay title" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTrackName} onChange={handleSwitch('showTrackName')} />} label="Track name" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showSessionType} onChange={handleSwitch('showSessionType')} />} label="Session type (Race, Qualy, Practice)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLapCounter} onChange={handleSwitch('showLapCounter')} />} label="Lap counter (current/total)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTimeRemaining} onChange={handleSwitch('showTimeRemaining')} />} label="Time remaining" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showWeatherInfo} onChange={handleSwitch('showWeatherInfo')} />} label="Weather info" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarClassFilter} onChange={handleSwitch('showCarClassFilter')} />} label="Car class filter" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showHighlightOwnCar} onChange={handleSwitch('showHighlightOwnCar')} />} label="Show your own car highlighted" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCarNumberHeader} onChange={handleSwitch('showCarNumberHeader')} />} label="Show car number in header" />
          </FormGroup>
        </MuiBox>
      )}
      {tab === 3 && (
        <MuiBox sx={{ p: 2, color: 'text.secondary' }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Footer options</Typography>
          <FormGroup sx={{ flexDirection: 'column', gap: 1 }}>
            <MuiFormControlLabel control={<MuiSwitch checked={config.showBestLapOverall} onChange={handleSwitch('showBestLapOverall')} />} label="Best lap (overall)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showBestLapOwn} onChange={handleSwitch('showBestLapOwn')} />} label="Best lap (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLastLapOwn} onChange={handleSwitch('showLastLapOwn')} />} label="Last lap (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showIncidentCountOwn} onChange={handleSwitch('showIncidentCountOwn')} />} label="Incident count (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showPitInfoOwn} onChange={handleSwitch('showPitInfoOwn')} />} label="Pit info (your car)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showCustomMessage} onChange={handleSwitch('showCustomMessage')} />} label="Custom message" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showLegend} onChange={handleSwitch('showLegend')} />} label="Show legend (icon meanings)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showTimeOfDay} onChange={handleSwitch('showTimeOfDay')} />} label="Show time of day" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showSessionState} onChange={handleSwitch('showSessionState')} />} label="Show session state (green, yellow, checkered)" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showGapToLeader} onChange={handleSwitch('showGapToLeader')} />} label="Show gap to leader" />
            <MuiFormControlLabel control={<MuiSwitch checked={config.showGapToNextPrev} onChange={handleSwitch('showGapToNextPrev')} />} label="Show gap to next/previous" />
          </FormGroup>
        </MuiBox>
      )}
    </MuiBox>
  );
};

const App: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = getTheme(mode);
  const muiTheme = useTheme();
  const isSm = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    if (mode === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [mode]);

  const drawer = (
    <Box sx={{ px: { xs: 1, sm: 2.5 }, pb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 1, mb: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              color="primary"
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label={mode === 'dark' ? 'Dark' : 'Light'}
          labelPlacement="start"
          sx={{
            '.MuiFormControlLabel-label': { fontWeight: 600, color: 'text.primary' },
          }}
        />
      </Box>
      <Typography variant="overline" sx={{ mb: 1, display: 'block', letterSpacing: 2, fontWeight: 700, color: theme.palette.text.secondary }}>
        OVERLAYS
      </Typography>
      <Divider sx={{ mb: 1, background: mode === 'dark' ? '#2c3440' : '#e0e3e7' }} />
      <List sx={{ mt: 1 }}>
        {sidebarOptions.map((text, idx) => (
          <ListItemButton
            key={text}
            selected={selected === idx}
            onClick={() => {
              setSelected(idx);
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              px: 2,
              py: 1.2,
              color: selected === idx ? (mode === 'dark' ? '#fff' : '#232a34') : theme.palette.text.primary,
              backgroundColor: selected === idx ? '#2196f3 !important' : 'transparent',
              fontWeight: selected === idx ? 700 : 400,
              boxShadow: 'none',
              transition: 'background 0.2s, color 0.2s',
              '&:hover': {
                backgroundColor: selected === idx ? '#1769aa' : (mode === 'dark' ? '#232a34' : '#e3e8f0'),
              },
            }}
          >
            <ListItemText
              primary={text}
              primaryTypographyProps={{ fontWeight: selected === idx ? 700 : 400 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        {/* Sidebar responsive */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                pt: 3,
                px: 0,
                backgroundColor: theme.palette.background.paper,
                transition: 'background 0.3s',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 0, sm: 0 }, backgroundColor: 'background.default', position: 'relative', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          {/* Top bar for mobile */}
          {isSm && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" color="primary" sx={{ flexGrow: 1 }}>
                iArsim
              </Typography>
            </Box>
          )}
          {selected === 2 ? (
            <RelativeConfigPanel mode={mode} />
          ) : (
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
              <Card sx={{ minWidth: 0, width: { xs: '100%', sm: 340, md: 420 }, flex: 1, boxShadow: 2, mb: 3, backgroundColor: mode === 'dark' ? '#23272f' : '#f4f6fa', border: 'none' }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Welcome to iArsim
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select an option from the menu to get started. Here you can see overlays and widgets with real-time iRacing data.
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 0, width: { xs: '100%', sm: 340, md: 420 }, flex: 1, boxShadow: 2, mb: 3, backgroundColor: mode === 'dark' ? '#23272f' : '#f4f6fa', border: 'none' }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Widget example
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Here you can show recent results, activity, or any other relevant data.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 