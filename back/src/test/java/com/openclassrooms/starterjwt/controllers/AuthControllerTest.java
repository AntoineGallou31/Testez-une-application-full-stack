package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static com.openclassrooms.starterjwt.JsonUtil.asJsonString;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:data.sql")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAuthenticateUser() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("test!1234");

        // When
        MvcResult result = mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/api/auth/login")
                                .content(asJsonString(loginRequest))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(MockMvcResultMatchers.status().isOk()).andReturn();

        // Then
        String resultRequest = result.getResponse().getContentAsString();
        JwtResponse user = objectMapper.readValue(resultRequest, JwtResponse.class);
        assertEquals(loginRequest.getEmail(), user.getUsername());
    }

    @Test
    void testRegisterUser() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test1@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password");

        // When
        MvcResult result = mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/api/auth/register")
                                .content(asJsonString(signupRequest))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(MockMvcResultMatchers.status().isOk()).andReturn();
    }


    @Test
    void testRegisterUser_EmailAlreadyExists() throws Exception {
        // Given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password");

        // When
        MvcResult result = mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .post("/api/auth/register")
                                .content(asJsonString(signupRequest))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(MockMvcResultMatchers.status().isBadRequest()).andReturn();
    }
}