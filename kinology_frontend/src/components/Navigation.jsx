import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import LogOut from "./LogOut";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const drawerWidth = 240;

const handleLogout = () => {
  console.log("logging out...");
  window.localStorage.removeItem("loggedKinologyUser");
  window.location.reload();
};

const Navigation = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }} className="site-title">
        Kinology
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <NavLink to="/about" className="nav-link">
              <ListItemText primary="About" />
            </NavLink>
          </ListItemButton>
        </ListItem>
        {props.user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <NavLink to="/users" className="nav-link">
                  <ListItemText primary="Users" />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <LogOut handleLogout={handleLogout} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <NavLink to="/login" className="nav-link">
                  <ListItemText primary="Log in" />
                </NavLink>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }}>
                <NavLink to="/signup" className="nav-link">
                  <ListItemText primary="Sign up" />
                </NavLink>
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}
      <AppBar component="nav" sx={{ bgcolor: "#549a71" }} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "#bdac4e" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link to="/" className="site-title">
              Kinology
            </Link>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button>
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </Button>
            {props.user ? (
              <>
                <Button sx={{ textAlign: "center" }}>
                  <NavLink to="/users" className="nav-link">
                    Users
                  </NavLink>
                </Button>

                <LogOut handleLogout={handleLogout} />
              </>
            ) : (
              <>
                <Button sx={{ textAlign: "center" }}>
                  <NavLink to="/login" className="nav-link">
                    Log in
                  </NavLink>
                </Button>

                <Button sx={{ textAlign: "center" }}>
                  <NavLink to="/signup" className="nav-link">
                    Sign up
                  </NavLink>
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          PaperProps={{
            sx: {
              bgcolor: "#549a71",
            },
          }}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Navigation;
