import { Box } from "@mui/material";
import React from "react";

const Login = () => {
  return (
    <Box display={"flex"} padding={0} margin={0}>
      
      <Box
        maxWidth={"50%"}
        flexBasis={"50%"}
        sx={{
          display: { xs: "none", sm: "none", md: "flex" },
        }}
        justifyContent={"center"}
        alignItems={"center"}
        overflow={"hidden"}
      >
        <img
          src="https://slir.netlify.app/assets/sidePanel_new-iCiYVcEK.svg"
          alt="register-image"
          style={{ height: "100vh", width: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </Box>

<Box flex={1} p={2}
        display={"flex"}
        justifyContent={"center"}
        // alignItems={"center"}
        >
<h1>Login</h1>


</Box>


    </Box>
  );
};

export default Login;
