import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import UserContext from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
// import AdbIcon from '@mui/icons-material/Adb';
import Cookies from 'js-cookie'

const pages = ['Home','Client Form', 'Client Details', 'Campaign Form', 'Campaign Details', 'Report Form', 'Report Details'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    // const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {userDetails} = useContext(UserContext)
    const navigate = useNavigate()

    const handleNavigation =(page)=>{
      const path = '/'+page.toLowerCase().replace(' ','')
      // console.log('clicked',path)
      navigate(path)
    }
    const handleLogout = ()=>{
      Cookies.remove('ssid')
      navigate('/login')

    }
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    // const handleOpenUserMenu = (event) => {
    //   setAnchorElUser(event.currentTarget);
    // };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);

    };
  
    // const handleCloseUserMenu = () => {
    //   setAnchorElUser(null);
    // };
  
    return (
      <AppBar position="static" sx={{backgroundColor:'black'}}>
        <Container maxWidth="ls">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography> */}
  
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none',xl:'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {userDetails.role==='superadmin'&&pages.map((page) => (
                  <MenuItem key={page} onClick={()=>handleNavigation(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                {userDetails.role==='user'&&['Home','Campaign Form', 'Report Form'].map((page) => (
                  <MenuItem key={page} onClick={()=>handleNavigation(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem  onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography> */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', xl:'flex' } }}>
              {userDetails.role==='superadmin'&&pages.map((page) => (
                <Button
                  key={page}
                  onClick={()=>handleNavigation(page)}
                  sx={{ my: 2, fontWeight:'bold', color: 'rgba(255,255,255,0.6)', display: 'block', '&:hover':{color:'rgba(255,255,255,1)'}, }}
                >
                  {page}
                </Button>
              ))}
              {
                userDetails.role==='user'&&['Home','Campaign Form', 'Report Form'].map((page) => (
                  <Button
                    key={page}
                    onClick={()=>handleNavigation(page)}
                    
                    sx={{ my: 2, fontWeight:'bold', color: 'rgba(255,255,255,0.6)', display: 'block', '&:hover':{color:'rgba(255,255,255,1)'}, }}
                  >
                    {page}
                  </Button>
                ))
              }
              <Button
                  
                  onClick={handleLogout}
                  sx={{ my: 2, fontWeight:'bold', color: 'rgba(255,255,255,0.6)', display: 'block', '&:hover':{color:'rgba(255,255,255,1)'}, }}
                >
                  Logout
                </Button>
            </Box>
  
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip >
              <Avatar>{userDetails.client_name[0]}</Avatar>
                {/* <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  
                </IconButton> */}
              </Tooltip>
              {/* <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu> */}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
}

export default Navbar