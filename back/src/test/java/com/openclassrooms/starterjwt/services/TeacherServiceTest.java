package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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

public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindAllTeachers() {
        // Given
        List<Teacher> teachers = new ArrayList<>();
        Teacher teacher1 = new Teacher();
        teacher1.setFirstName("John");
        teacher1.setLastName("Doe");

        Teacher teacher2 = new Teacher();
        teacher2.setFirstName("Jane");
        teacher2.setLastName("Doe");

        teachers.add(teacher1);
        teachers.add(teacher2);

        when(teacherRepository.findAll()).thenReturn(teachers);

        // When
        List<Teacher> foundTeachers = teacherService.findAll();

        // Then
        assertNotNull(foundTeachers);
        assertEquals(2, foundTeachers.size());
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    public void testFindTeacherById_ExistingId() {
        // Given
        Long id = 1L;
        Teacher teacher = new Teacher();
        teacher.setFirstName("John");
        teacher.setLastName("Doe");

        when(teacherRepository.findById(id)).thenReturn(Optional.of(teacher));

        // When
        Teacher foundTeacher = teacherService.findById(id);

        // Then
        assertNotNull(foundTeacher);
        assertEquals(teacher, foundTeacher);
        verify(teacherRepository, times(1)).findById(id);
    }

    @Test
    public void testFindTeacherById_NonExistingId() {
        // Given
        Long id = 999L;
        when(teacherRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Teacher foundTeacher = teacherService.findById(id);

        // Then
        assertNull(foundTeacher);
        verify(teacherRepository, times(1)).findById(id);
    }
}