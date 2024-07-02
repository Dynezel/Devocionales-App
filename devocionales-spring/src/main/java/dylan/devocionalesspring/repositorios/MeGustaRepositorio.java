package dylan.devocionalesspring.repositorios;

import dylan.devocionalesspring.entidades.MeGusta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeGustaRepositorio extends JpaRepository<MeGusta, Long> {
    Optional<MeGusta> findByUsuarioIdAndDevocionalId(Long usuarioId, Long devocionalId);

    long countByDevocionalId(Long devocionalId);
}