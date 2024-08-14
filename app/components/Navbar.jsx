"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Logo from "./Logo";
import { Menu, MenuItem, IconButton, AvatarIcon } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  if (status === "loading") {
    return (
      <div className="absolute top-0 flex justify-between h-20 bg-blue-200 shadow-md w-full">
        <Logo />
        <div className="h-20 flex items-center justify-center">
          <Image src='/loader' width={20} height={20} alt="...Loading"/>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 flex justify-between h-20 bg-blue-200 shadow-md w-full ">
      <Logo />
      {session?.user?.image ? (
        <div>
          <IconButton onClick={handleClick}>
            <Image
              src={session.user.image}
              alt={session.user.name || "User Avatar"}
              width={50}
              height={50}
              className="rounded-full"
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout <span className='ml-10'><LogoutIcon /></span></MenuItem>
            </Menu>
        </div>
      ) : (
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <AvatarIcon/>
        </div>
      )}
    </div>
  );
}

export default Navbar;
