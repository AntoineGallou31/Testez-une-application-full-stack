package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

import static com.openclassrooms.starterjwt.JsonUtil.asJsonString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "testuser", roles = {"ADMIN"})
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD, scripts = "classpath:data.sql")
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final Date fixedDate = new Date(1234567890123L);

    private SessionDto sessionDto;

    @BeforeEach
    public void setup() {
        sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setDate(fixedDate);
        sessionDto.setDescription("description");
        sessionDto.setName("name");
        sessionDto.setTeacher_id(10L);
        sessionDto.setUsers(new ArrayList<Long>(Arrays.asList(1L, 2L)));
    }

    @Test
    public void testFindById() throws Exception {
        // Given
        Long sessionId = 1L;

        // When
        mockMvc.perform(get("/api/session/" + sessionId))

        // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(sessionId));
    }

    @Test
    public void testFindAll() throws Exception {
        // Given

        // When
        mockMvc.perform(get("/api/session"))

        // Then
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testCreate() throws Exception {
        // Given

        // When
        mockMvc.perform(
                MockMvcRequestBuilders
                        .post("/api/session")
                        .content(asJsonString(sessionDto))
                        .contentType(MediaType.APPLICATION_JSON)
        )

        // Then
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(
                        MockMvcResultMatchers.jsonPath("$.id").value(sessionDto.getId())
                );
    }

    @Test
    public void testUpdate() throws Exception {
        // Given
        Long sessionId = 1L;

        // When
        mockMvc.perform(
                MockMvcRequestBuilders
                        .put("/api/session/" + sessionId)
                        .content(asJsonString(sessionDto))
                        .contentType(MediaType.APPLICATION_JSON)
        )

        // Then
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(
                        MockMvcResultMatchers.jsonPath("$.id").value(sessionDto.getId())
                );
    }

    @Test
    public void testParticipate() throws Exception {
        // Given
        Long sessionId = 1L;
        Long userId = 2L;

        // When
        mockMvc.perform(post("/api/session/" + sessionId + "/participate/" + userId))

        // Then
                .andExpect(status().isOk());
    }

    @Test
    public void testNoLongerParticipate() throws Exception {
        // Given
        Long sessionId = 1L;
        Long userId = 1L;

        // When
        mockMvc.perform(delete("/api/session/" + sessionId + "/participate/" + userId))

        // Then
                .andExpect(status().isOk());
    }
}