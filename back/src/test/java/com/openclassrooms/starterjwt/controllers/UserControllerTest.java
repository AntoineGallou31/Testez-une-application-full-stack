package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:data.sql")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "test@example.com") // Simulate logged in user
    public void testFindById_ExistingUser() throws Exception {
        // Given
        Long userId = 1L;

        // When
        mockMvc.perform(get("/api/user/" + userId))

        // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(userId))
                .andExpect(jsonPath("$.email").value("admin@example.com"));
    }

    @Test
    @WithMockUser(username = "test@example.com") // Simulate logged in user
    public void testFindById_NonExistingUser() throws Exception {
        // Given
        Long nonExistingUserId = 3L;

        // When
        mockMvc.perform(get("/api/user/" + nonExistingUserId))

        // Then
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "test@example.com") // Simulate logged in user
    public void testDeleteUser_Authorized() throws Exception {
        // Given
        Long userId = 2L;

        // When
        mockMvc.perform(delete("/api/user/" + userId))

        // Then
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "other@example.com") // Simulate different logged in user
    public void testDeleteUser_Unauthorized() throws Exception {
        // Given
        Long userId = 1L;

        // When
        mockMvc.perform(delete("/api/user/" + userId))

        // Then
                .andExpect(status().isUnauthorized());
    }
}