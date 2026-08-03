import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
