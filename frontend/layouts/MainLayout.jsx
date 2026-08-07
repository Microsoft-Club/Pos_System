import React, { useState, useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';

export default function MainLayout() {
  const loaderData = useLoaderData();
  const [user, setUser] = useState(loaderData?.user ?? null);

  useEffect(() => {
    setUser(loaderData?.user ?? null);
  }, [loaderData]);

  return <Outlet context={{ user, setUser }} />;
}
