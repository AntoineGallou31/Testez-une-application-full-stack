
package com.openclassrooms.starterjwt.repository;

import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class TeacherRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TeacherRepository teacherRepository;

    @Test
    public void testSaveTeacher() {
        // Given
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane");
        teacher.setLastName("Doe");

        // When
        Teacher savedTeacher = teacherRepository.save(teacher);

        // Then
        assertNotNull(savedTeacher.getId());
        assertEquals(teacher.getFirstName(), savedTeacher.getFirstName());
    }

    @Test
    public void testFindById() {
        // Given
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane");
        teacher.setLastName("Doe");
        entityManager.persistAndFlush(teacher);

        // When
        Teacher foundTeacher = teacherRepository.findById(teacher.getId()).orElse(null);

        // Then
        assertNotNull(foundTeacher);
        assertEquals(teacher.getFirstName(), foundTeacher.getFirstName());
    }

    @Test
    public void testDeleteTeacher() {
        // Given
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane");
        teacher.setLastName("Doe");
        entityManager.persistAndFlush(teacher);

        // When
        teacherRepository.deleteById(teacher.getId());

        // Then
        assertFalse(teacherRepository.findById(teacher.getId()).isPresent());
    }

    @Test
    public void testUpdateTeacher() {
        // Given
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane");
        teacher.setLastName("Doe");
        entityManager.persistAndFlush(teacher);

        // When
        teacher.setFirstName("Updated Jane");
        Teacher updatedTeacher = teacherRepository.save(teacher);

        // Then
        assertEquals("Updated Jane", updatedTeacher.getFirstName());
    }

}
