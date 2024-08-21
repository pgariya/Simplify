import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { countries } from "countries-list";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { API_BASE_URL } from "../constant";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const { control, register, handleSubmit, watch, formState } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpResendEnabled, setOtpResendEnabled] = useState(false);
  const [attempts, setAttempts] = useState(Number(sessionStorage.getItem("Attempts")) || Number(0));

  const [isBlocked, setIsBlocked] = useState(sessionStorage.getItem("isBlocked") || false);

  let navigate = useNavigate();

  // Watch email field value
  const email = watch("email");
  const mobile = watch("mobile");
  const name = watch("name");
  const salutation = watch("salutation");

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpResendEnabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  let salutations = [
    { label: "Mr." },
    { label: "Mrs." },
    { label: "Miss" },
    { label: "Dr." },
    { label: "Ms." },
    { label: "Prof." },
  ];

  const countryList = Object.entries(countries).map(([code, data]) => ({
    code: `+${data.phone}`,
    name: data.name,
    label: `${data.name} (+${data.phone})`,
  }));

  countryList.sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      console.log(data, "dataa???");

      if (!otpSent) {
        console.log("Send -otp");
        let response = await axios.post(
          // `${API_BASE_URL}/api/user/send-otp`,
          `https://colo-dev.infollion.com/api/v1/self-registration/register`,

          { salutation: data.salutation.label, name: data.name, email: data.email, mobile: data.mobile }
          ,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response, "response..");


        if (response.data.success) {
          toast.success(response.data.message, {
            position: "bottom-center",
            theme: "colored",
          });
          setOtpSent(true);
        } else {

          toast.error(response.data.message, {
            position: "bottom-center",
            theme: "colored",
          });
        }

      } else {
        console.log("verify -otp");

        setAttempts(Number(attempts) + 1);
        sessionStorage.setItem("Attempts", Number(attempts) + 1);

        if (attempts + 1 >= 5) {
          setIsBlocked(true);
          sessionStorage.setItem("isBlocked", true);

          toast.error(" You have reached the maximum number of attempts. Please try again later.", {
            position: "bottom-center",
            theme: "colored",
          });

          return;

        }



        // verify otp ---
        let res = await axios.post(
          // `${API_BASE_URL}/api/user/verify-otp`,
          `https://colo-dev.infollion.com/api/v1/self-registration/verify-otp`,
          {
            action: "SelfRegister",
            email: data.email,
            otp: data.otp,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(res, "reponsee");

        if (res.status == "200") {

          toast.success(res.data.message, {
            position: "bottom-center",
            theme: "colored",
          });
          setOtpSent(true);
          setAttempts(0);
          sessionStorage.setItem("Attempts", Number(0));
          sessionStorage.setItem("isBlocked", false);
          navigate("/login");



        } else {

          toast.error(res.data.message, {
            position: "bottom-center",
            theme: "colored",
          });

        }



        // if (response.status === 200) {
        //   toast.success(response.data.message, {
        //     position: "bottom-center",
        //     theme: "colored",
        //   });
        //   setOtpSent(true);
        //   navigate("/login");
        // } else {
        //   toast.error(response.data.message, {
        //     position: "bottom-center",
        //     theme: "colored",
        //   });
        // }

      }
    } catch (error) {

      console.log(error, "error");
      console.log(error.message, "message");
      console.log(error.response, "responseee");


      if (error.response?.data?.error || error.response?.data?.message) {
        toast.error(
          error.response.data.error || error.response.data.message || "An error occurred. Please try again.",
          {
            position: "bottom-center",
            theme: "colored",
          }
        );
      } else {

        toast.error("An error occurred. Please try again.", {
          position: "bottom-center",
          theme: "colored",
        });
      }
    }
  };


  const otpResendFunction = async () => {
    try {
      console.log("resend -otp");


      let response = await axios.post(
        // `${API_BASE_URL}/api/user/resend-otp`,
        `https://colo-dev.infollion.com/api/v1/self-registration/register`,
        {
          name: name,
          email: email,
          mobile: mobile,
          salutation: salutation.label
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response, "responsee");

      if (response.data.success) {
        toast.success(response.data.message, {
          position: "bottom-center",
          theme: "colored",
        });
        setTimer(60);
        setOtpResendEnabled(false);
        setOtpSent(true);
      } else {
        toast.error(response.data.message, {
          position: "bottom-center",
          theme: "colored",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "An error occurred. Please try again.",
          {
            position: "bottom-center",
            theme: "colored",
          }
        );
      } else {
        toast.error("An error occurred. Please try again.", {
          position: "bottom-center",
          theme: "colored",
        });
      }
    }
  };

  return (
    <Box display={"flex"} padding={0} margin={0}>
      <Box
        id="image-box"
        maxWidth={"50%"}
        flexBasis={"50%"}
        sx={{
          display: { xs: "none", sm: "none", md: "flex" },
        }}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        overflow={"hidden"}
      >
        <img
          id="image-svg"
          src="https://slir.netlify.app/assets/sidePanel_new-iCiYVcEK.svg"
          alt="register-image"
          style={{ height: "100vh", width: "100%" }}
          loading="lazy"
        />
      </Box>

      <Box
        flex={1}
        display={"flex"}
        justifyContent={"center"}
        // alignItems={"center"}
        p={{ xs: 1, sm: 2, md: 2, lg: 4 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} id="signup-form">
          <Box
            width={{ xs: "95%", sm: "90%", md: "70%" }}
            margin={"auto"}
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <img
              width={120}
              height={"auto"}
              alt="logo"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAMAAAD0WI85AAAA2FBMVEVHcEztmCfslSLslSLslSKbf2LslSKPembtmCfslSJ9eHZ4cnFvaWp0bm5vaWqCfXqEf3zslSKEf3xvaWpvaWpvaWqEf3x9eHZvaWqEf3zslSJvaWpvaWrsliNvaWrslSKEf3xvaWqEf3yEf3xvaWpvaWqEf3zsliJvaWpvaWpvaWrslSKEf3yEf3zslSKEf3zslSKEf3yEf3xvaWrslSLslSLslSKEf3yEf3zslSKEf3xvaWqEf3zslSLslSJvaWpvaWrslSLslSLslSLsfwBvaWrslSKEf3wnlXcMAAAARHRSTlMADZpR+wn2AxfYERoqIac5jc6bUN5zRzKhyD7lXiI/42/7WqvqkNjEsoHQ7Cj5SuOM6vz3RakS9n838vK4ti7twntjcEQBplMAAAsQSURBVHja7JoLd6I8E4DxglEQpShSKiJKpdZLEVxF8dbao/z/f/QlAeQitrRrv/f1PZ09e9YlYTJPJpeZBIL4lV/5lV/5lV+5gpDFYuY/gFF835RKT2+tW+fYPh2xlP7cuD88juOxvbxpkLfjSWbkDXPM7wKQ4faWZ8gwAMnnbhhkWQiB7G8YpNUOQAq3vG6RswCkVLzlVeslGFvvN738gjefJHvjYQrY3+XRdvh2++FWMff2tv8HQq3t/m2/vfneIzJvbTwQyFsHmXib19uNcyyH/47ACFCphwQoy2Xg/mIY8jxYvd6qn8lNsm9f6heG7w9eeSpVXer5cfrYQ3WZ+3qzL3uPsyeQydU29wlefh/Se0OqH5A8p6ot4boSbOce/RjQkSkC5WqT5MHdEWcg7Qv8FNt2eE01urD5h3vokCb60am5j//4+3Dh4Vog3mi9m6esLzy6HIcK+BJIeef7JhLkZckrr4OpQXiPoy4TfwFCFGfIJ4Xs9SLV7BdBnpE5O75WTle9cgEErTGzycsV98NvgQyotOovglxdvgXy+p8BIW8JhCzLNakmhDofAOCB0NTZ3j5vbbetOUgNkln+WcZzB0AzDH3B22S5xvO8JDPgayC01G9OO4fOavAseCGGVOlXKgNkzmowgHt7CGWey961h8P2XTZXTAfS2hQKhU04fSDl5/6g2ay/3kv0mZllvt/sIAXTeqVGpQcB0uBwksceg57Jq+DRASqdhlagp/xpq37KgUSQxwgIcDeSbNCi3D/p7wz4KArda4bb7stpQaje9BCWAdqQe4eY9PzOnQUYaHOYzD8HmZfcZjOnFlcR3a9hW+VBrOUdD1KB0P24zU3Jm+Zh4b1Uzz0/Hj7NZk/u8VJ2fgmkI0UPovxm6cpZi7XAV8144WF6TpIAQvlaV/VB03PNY40oDzqHiINd97cwR+l9mwEgs30rRQOPSx7xQTLRFjurlT8Wmr5PynXPDa+V+37ds2FVSwHidf2AF2iaqfVcCwYMwdRqkoSd9chLkjflSKxgdpq1LTT4836WAT7xyFMm3GK9V5MFmX/t+C3iBlwVu55AAbis1fqR0o9AZLfJeyY6Qr0ZgWdKnY6ejIXGEpFBGtvbZJBDLQnEbxGHPYCgvETBbbGGXVQ/eYDkd+GB/QGIG+f1yCDHwyTNchIIDmM38OWHyZIgclkYlc83CA2kBwG4xc5zsJzL9VOLZD8yznDcin3SJz8BoevhDMjtlFXQBTEQdJ4/hNbn2jDXAxucoT3AZ+1WepAynswV8qxFlLsJu7Pup16xDcwnIPI0PJZD5vTBaTgHIHvkEJJolVyE0vFp7u4R+/QgOIt8FM5a7KBISDo3GuBUYid8AiLFJgHuoM4p5I2BTNzzg/djAV+v5ArommV/2upSgfSCboq2iOx/vlS4kj8B4RMGILYCWw+iIKjz8y/onw1+Y36HknCUyLr/P1u1EkDcOrEjAFx9JXiUlWghHjQpQaJdgEex698oCLnBaTecHG7Sn7lDxyLoHMBdj1KB9BMWITxTka29hLQaB0vfB2kmgICNe0OU9a5X4Nz3PPJ3IACfVQQeiZojrK7uEfw6nNe5PN5LirPjcIlmDBxaIC1Ioq1490Bdd10Q5iLI3j1KQnvH02RyhzcQvGpNiNQekULblO+Rnp+IJoKgJXl6XZClt4/4X1Bsiu4+4t1IpvKIe8LUCzfp7vXPF9xV/i4IuAyCZju2Hn/Tstmj8YUePc3jIM2LIG6laWiWuLHETr4E8nh9j8Cdw7+3I4tFEp9Yhe66U4F4Kdvq2dMKam50dw9+EoSPgeBgKx/cQGJ/HGeZL4AA0PPjbZlhylLFzbHqZeJnQJqJIETrLkzScjmKxFc8QtCvfgbUrO+iGceVQeoxkHDss8UkE3DyRz6I6gMQ5iMQovwazwFXEvEDIHT9skc8LwzRMgUmmCmTkLPHQLyvYHwQgrnvxE8JwLdA2q1I0NiLXVAN/MjeXfRjJ43zrPeZFL5Ri9zYP/t3KTSewI/l6G3GCYQgpVAm3ewxEQW9WPyCdO3KiSDBJzU0zCUH1fj54uqw4r3iaaceT5jnT25XoO3xLnKwhRPuV8a7V+k8g+glQDt0sEXV7gfN1WpX7/Nl4uQCBia+g/iJOb86THvJiVW+tAwU1pizYz5Zkj3dlJxwEg/tGrbC8XuQXvYqPOMuqvf3kt/4QzvxwooqC3KZjlpI12pn53VA5mtkcqp7PJZeUl9and9DbtyPcoL4/ZNL3dMHb8OrfSUWXEsOZ7ltcT6fF78sy2ze9UTxDp3PbT+u3dq+h76uGk4eit+VyElzNnRGmB+WviXD07nJO7bt49rt4TEihdK3ZUImg/yFeEMkMzv+P2XYugiS/5YMN/7l7HzSLsAHqVUV/kpmmUSQ4Wayz31HXrYhha0/kaIP5M/Ln0vykCxL/Hd5kkzSHClkl9e7mgT4z49pAB+sWsM9ON1L/eRnLORoRP2I4mz0mxCqwaprThldqD1ikSgN+tvtVXWD9ZAU1pVG2ncphVXAJyBDd2OvrseOYzqOviATvdh1sJiaQp4Vg6g7Q44NPSSqY4fzAjjNVeawZyMnSQl8l9Ydkbw0uLLhj2VHmjNWuw0FNrEAQOFYhVNZIQoiKgqnO+YCxUGwmFOgd0Ycp7AqV2UUFdcHI1iislVAkAuoRFUXyMVkF1ZnfRACghgLBUqVUDiuSwgctyCRpoWqKiiqAVX4i21A07uwnF3QrO0YsA5BQUVqfNSEw3jAOg5HYv87xgisYdcbpqNXIyCo/xqGozNEQ3NMG5KNsKNMWBP2g4PqU2vHMizHaKBOdMYGrkRxY2cMy0Me0RuCIIwAbk8RHatLNOBwMC1Yv0qAheFYtjPmKIJFw0QciUjXmgKcaeq2w4GLICTU5Q5Y1TG7EMRcjBQTNkwt0FheUMhiZAYssqqUCHu0y6Fy2LzW7UKb2SqLURvcQsEltObY3RHnOAqhOM660Vg7IY84lmWNNRr3jOnYCvwxdvSuAN22Bg0ber8Lje8iEE2pAkF3tBGNdOpKV/ngNB6Z3iVconED/s8YEYLtqMTIQGPZQF1vIjMggy1UYW8ZBuptEoKw6CVYo2rB+jSn2xbsVxXARkXMvyA4qBNbGnjEEtfrNYdWMcWbK24x1K/TC8exdcNGz1nHVFAg7M4R5CpTVxsfZIhd2LMNEtCwR0QqAAFkFwuJPUJSI9RjJKQzOBbNEuCD6BAEgaPO78JKJxATgiBrAIE97HtEH1EU/vSAho5yNAGDrCkCdT0FlWgs1A9XNRb3AQahKECMGopqOxp9GYSEjdviGvpcqxIhkNM6AUEMUdRxOQm7eM2qaIELgyCPoDWBFWMeEeAoU6EBIY+MRSQLglLhTwtNJAjiiJyGFhMGelhlRQ2OEQ8EDYS12BA0kV1oH4LAhWVtjE1bY+GSAFRLgyC6FZpVXdu2LdsQUTmcOZplWhoCsa0FQa4tjSGqhgXnFKuPxxr6RYsWAkHlcG23TVs0LG+5pUSoC00SlWRtm6UWtqVSaI7o5hgv7yNON+ELCMQy8EBqiJapK/9r14xRGIZhKBoIQuBgtElrDqChW7vn/neqZItSOhQS2u2/wcH2d+QQpAhHMX6f498OH8hFZT6ri9FCJm9xrklgr2/zVtpmeQk9p75n/I0Jj5UcDeeylJGptTE/XonLxNnKklD6SK8NcNxFRy3MJlUSEwY9/+2G3c/8YL0Njt+XRPMpQXV0utCFLIlHdvbX9OoMfX/oAgAAAAAAAAAAXOEJDmnRJd24gzwAAAAASUVORK5CYII="
            />

            <h2>Register as an expert</h2>

            <Box display={"flex"} gap={{ xs: 1, sm: 2 }} width={"100%"}>
              <Box w={"30%"}>
                <Controller
                  name="salutation"
                  control={control}
                  rules={{ required: "Salutation is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      disablePortal
                      options={salutations}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value?.label
                      }
                      disabled={otpSent}
                      onChange={(_, newValue) => onChange(newValue)}
                      value={value || null}
                      sx={{
                        width: "100%",
                        minWidth: { xs: "100px", sm: "100px", md: "150px" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Mr/Mrs*"
                          size="small"
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : null}
                          disabled={otpSent}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <TextField
                label="Name*"
                variant="outlined"
                size="small"
                fullWidth
                name="name"
                disabled={otpSent}
                error={!!formState.errors.name}
                helperText={
                  !!formState.errors.name ? formState.errors.name.message : null
                }
                {...register("name", {
                  required: "Name is Required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters long",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name cannot exceed 50 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s'-]+$/,
                    message:
                      "Name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                })}
              />
            </Box>

            <Box display={"flex"} gap={{ xs: 1, sm: 2 }} width={"100%"}>
              <Box w={"30%"}>
                <Controller
                  name="isd"
                  control={control}
                  rules={{ required: "ISD code is required" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      disablePortal
                      options={countryList}
                      getOptionLabel={(option) =>
                        `${option.name} (${option.code})`
                      }
                      // here i have done this (${option.code})` but there are option.code same (for some ) so key are unique so that's why --->
                      isOptionEqualToValue={(option, value) =>
                        option.code === value?.code
                      }
                      disabled={otpSent}
                      value={value || null}
                      sx={{
                        width: "100%",
                        minWidth: { xs: "100px", sm: "100px", md: "150px" },
                      }}
                      onChange={(_, newValue) => onChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="ISD*"
                          size="small"
                          fullWidth
                          error={!!error}
                          helperText={error ? error.message : null}
                          disabled={otpSent}
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <TextField
                label="Mobile Number*"
                variant="outlined"
                size="small"
                fullWidth
                name="mobile"
                disabled={otpSent}
                error={!!formState.errors.mobile}
                helperText={
                  !!formState.errors.mobile
                    ? formState.errors.mobile.message
                    : null
                }
                {...register("mobile", {
                  required: "Mobile Number is required",
                  pattern: {
                    value:
                      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm,
                    message: "Not a Valid Mobile Number",
                  },
                  minLength: {
                    value: 6,
                    message: "Mobile Number is Not less than 6 digits",
                  },
                  maxLength: {
                    value: 12,
                    message: "Mobile Number is not more than 12 digits",
                  },
                })}
              />
            </Box>

            <TextField
              fullWidth
              id="outlined-basic"
              label="Email ID*"
              variant="outlined"
              size="small"
              name="email"
              disabled={otpSent}
              error={!!formState.errors?.email}
              helperText={
                !!formState.errors.email ? formState.errors.email.message : null
              }
              {...register("email", {
                required: "Email is Required",
                pattern: {
                  value:
                    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                  message: "Enter a valid email address",
                },
              })}
            />

            {otpSent && (
              <Box mb={2} width={"100%"}>
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: "OTP is required",
                    maxLength: {
                      value: 6,
                      message: "OTP should be upto 6 Characters",
                    },
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="OTP*"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!formState.errors.otp}
                      helperText={formState.errors.otp?.message}
                    />
                  )}
                />
                <Box color={"#ed9323"} mt={"8px"} textAlign={"right"}>
                  {otpResendEnabled ? (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={otpResendFunction}
                    >
                      Resend OTP
                    </span>
                  ) : (
                    `Resend OTP in ${timer} sec`
                  )}
                </Box>
              </Box>
            )}

            {!otpSent ? (
              <Button variant="contained" type="submit" fullWidth id="otp-btn" >
                Get OTP on email
              </Button>
            ) : (
              <Button variant="contained" type="submit" fullWidth id="otp-btn">
                Submit OTP
              </Button>
            )}

            <p>
              Already have an account?{" "}
              <a href="/login" style={{ textDecoration: "none" }}>
                {" "}
                Sign In
              </a>
            </p>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
