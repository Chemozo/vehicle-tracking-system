import { Formik, Form } from "formik";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../utils/api";
import { LoginCredentials } from "../../types/LoginCredentials";

// Validation schema
const LocationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (values: LoginCredentials) => {
    console.log("imhere");

    const login = async () => {
      console.log("Request payload:", values); // Debug the request payload

      try {
        const response = await authApi.login(values);
        console.log("Response:", response);
        localStorage.setItem("token", response.data.access);

        localStorage.setItem("refreshToken", response.data.refresh);
        navigate("/map");
      } catch (error) {
        console.error("Error logging in:", error);
      }
    };

    login();
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={LocationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />

                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};
