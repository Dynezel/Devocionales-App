package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.MeGusta;
import dylan.devocionalesspring.servicios.MeGustaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/megusta")
public class MeGustaControlador {

    @Autowired
    private MeGustaServicio meGustaServicio;

    @PostMapping("/toggle")
    public MeGusta toggleMeGusta(@RequestParam("usuarioId") Long usuarioId,
                                 @RequestParam("devocionalId") Long devocionalId) {
        return meGustaServicio.darMeGusta(usuarioId, devocionalId);
    }

    @GetMapping("/contar")
    public long contarMeGustas(@RequestParam Long devocionalId) {
        return meGustaServicio.contarMeGustasPorDevocional(devocionalId);
    }
}
