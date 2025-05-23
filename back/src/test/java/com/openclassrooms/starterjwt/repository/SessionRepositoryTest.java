package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Session;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class SessionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SessionRepository sessionRepository;

    @Test
    public void testSaveSession() {
        // Given
        Session session = new Session();
        session.setName("Test Session");
        session.setDescription("Test Description");
        session.setDate(new Date());

        // When
        Session savedSession = sessionRepository.save(session);

        // Then
        assertNotNull(savedSession.getId());
        assertEquals(session.getName(), savedSession.getName());
    }

    @Test
    public void testFindById() {
        // Given
        Session session = new Session();
        session.setName("Test Session");
        session.setDescription("Test Description");
        session.setDate(new Date());
        entityManager.persistAndFlush(session);

        // When
        Session foundSession = sessionRepository.findById(session.getId()).orElse(null);

        // Then
        assertNotNull(foundSession);
        assertEquals(session.getName(), foundSession.getName());
    }

    @Test
    public void testDeleteSession() {
        // Given
        Session session = new Session();
        session.setName("Test Session");
        session.setDescription("Test Description");
        session.setDate(new Date());
        entityManager.persistAndFlush(session);

        // When
        sessionRepository.deleteById(session.getId());

        // Then
        assertFalse(sessionRepository.findById(session.getId()).isPresent());
    }

    @Test
    public void testUpdateSession() {
        // Given
        Session session = new Session();
        session.setName("Test Session");
        session.setDescription("Test Description");
        session.setDate(new Date());
        entityManager.persistAndFlush(session);

        // When
        session.setName("Updated Session");
        Session updatedSession = sessionRepository.save(session);

        // Then
        assertEquals("Updated Session", updatedSession.getName());
    }

    @Test
    public void testFindAll() {
        // Given
        Session session1 = new Session();
        session1.setName("Session 1");
        session1.setDescription("Description 1");
        session1.setDate(new Date());
        entityManager.persistAndFlush(session1);

        Session session2 = new Session();
        session2.setName("Session 2");
        session2.setDescription("Description 2");
        session2.setDate(new Date());
        entityManager.persistAndFlush(session2);

        // When
        List<Session> sessions = sessionRepository.findAll();

        // Then
        assertTrue(sessions.size() >= 2);
        assertTrue(sessions.contains(session1));
        assertTrue(sessions.contains(session2));
    }
}