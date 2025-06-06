package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:data.sql")
public class TeacherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "test@example.com") // Simulate logged in user
    public void testFindById_ExistingTeacher() throws Exception {
        // Given
        Long teacherId = 1L;

        // When
        mockMvc.perform(get("/api/teacher/" + teacherId))

        // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(teacherId))
                .andExpect(jsonPath("$.firstName").value("Teacher One"));
    }

    @Test
    @WithMockUser(username = "test@example.com") // Simulate logged in user
    public void testFindById_NonExistingTeacher() throws Exception {
        // Given
        Long nonExistingTeacherId = 3L;

        // When
        mockMvc.perform(get("/api/teacher/" + nonExistingTeacherId))

        // Then
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "test@example.com") // Simulate logged in user
    public void testFindAll() throws Exception {
        // Given

        // When
        mockMvc.perform(get("/api/teacher"))

        // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstName").value("Teacher One"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].firstName").value("Teacher Two"));
    }
}