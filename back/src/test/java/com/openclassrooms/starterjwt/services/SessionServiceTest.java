package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession);
        assertEquals(session, createdSession);

        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testDeleteSession() {
        Long id = 1L;

        sessionService.delete(id);

        verify(sessionRepository, times(1)).deleteById(id);
    }

    @Test
    public void testFindAllSessions() {
        List<Session> sessions = new ArrayList<>();
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> foundSessions = sessionService.findAll();

        assertNotNull(foundSessions);
        assertEquals(sessions, foundSessions);

        verify(sessionRepository, times(1)).findAll();
    }


    @Test
    public void testGetSessionById() {
        Long id = 1L;
        Session session = new Session();
        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        Session foundSession = sessionService.getById(id);

        assertNotNull(foundSession);
        assertEquals(session, foundSession);

        verify(sessionRepository, times(1)).findById(id);
    }

    @Test
    public void testUpdateSession() {
        Long id = 1L;
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(id, session);

        assertNotNull(updatedSession);
        assertEquals(id, updatedSession.getId());

        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testParticipate() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setUsers(new ArrayList<>());
        User user = new User();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertDoesNotThrow(() -> sessionService.participate(sessionId, userId));
        assertTrue(session.getUsers().contains(user));

        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    public void testParticipate_UserNotFound() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(new Session()));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
    }



    @Test
    public void testNoLongerParticipate_SessionNotFound() {
        Long sessionId = 1L;
        Long userId = 1L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }

    @Test
    public void testNoLongerParticipate_UserNotParticipated() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }

    @Test
    public void testNoLongerParticipate_Success() {
        Long sessionId = 1L;
        Long userId = 1L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, userId);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }
}