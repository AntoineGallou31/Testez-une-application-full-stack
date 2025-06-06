package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testDeleteUser() {
        // Given
        Long id = 1L;

        // When
        userService.delete(id);

        // Then
        verify(userRepository, times(1)).deleteById(id);
    }

    @Test
    public void testFindUserById_ExistingId() {
        // Given
        Long id = 1L;
        User user = new User();
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        // When
        User foundUser = userService.findById(id);

        // Then
        assertNotNull(foundUser);
        assertEquals(user, foundUser);
        verify(userRepository, times(1)).findById(id);
    }

    @Test
    public void testFindUserById_NonExistingId() {
        // Given
        Long id = 999L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        // When
        User foundUser = userService.findById(id);

        // Then
        assertNull(foundUser);
        verify(userRepository, times(1)).findById(id);
    }
}