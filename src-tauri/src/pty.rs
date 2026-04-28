use std::collections::HashMap;

pub struct PtySession {
    pub id: String,
    pub command: String,
    pub is_alive: bool,
}

pub struct PtyManager {
    sessions: HashMap<String, PtySession>,
}

impl PtyManager {
    pub fn new() -> Self {
        Self {
            sessions: HashMap::new(),
        }
    }

    pub fn spawn(&mut self, id: &str, command: &str) -> Result<(), String> {
        if self.sessions.contains_key(id) {
            return Err(format!("sesión '{}' ya existe", id));
        }
        self.sessions.insert(
            id.to_string(),
            PtySession {
                id: id.to_string(),
                command: command.to_string(),
                is_alive: true,
            },
        );
        Ok(())
    }

    pub fn kill(&mut self, id: &str) -> Result<(), String> {
        let session = self.sessions.get_mut(id).ok_or_else(|| format!("sesión '{}' no encontrada", id))?;
        session.is_alive = false;
        Ok(())
    }

    pub fn write(&mut self, id: &str, _input: &str) -> Result<(), String> {
        let session = self.sessions.get(id).ok_or_else(|| format!("sesión '{}' no encontrada", id))?;
        if !session.is_alive {
            return Err(format!("sesión '{}' no está viva", id));
        }
        Ok(())
    }

    pub fn is_alive(&self, id: &str) -> bool {
        self.sessions.get(id).map(|s| s.is_alive).unwrap_or(false)
    }

    pub fn session_count(&self) -> usize {
        self.sessions.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn puede_crear_un_manager_vacio() {
        let m = PtyManager::new();
        assert_eq!(m.session_count(), 0);
    }

    #[test]
    fn puede_lanzar_un_proceso() {
        let mut m = PtyManager::new();
        assert!(m.spawn("s1", "echo hola").is_ok());
        assert_eq!(m.session_count(), 1);
    }

    #[test]
    fn puede_lanzar_multiples_sesiones() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        m.spawn("s2", "bash").unwrap();
        assert_eq!(m.session_count(), 2);
    }

    #[test]
    fn no_puede_lanzar_dos_sesiones_con_mismo_id() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        assert!(m.spawn("s1", "zsh").is_err());
    }

    #[test]
    fn proceso_recien_lanzado_esta_vivo() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        assert!(m.is_alive("s1"));
    }

    #[test]
    fn puede_terminar_una_sesion() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        assert!(m.kill("s1").is_ok());
    }

    #[test]
    fn sesion_terminada_no_esta_viva() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        m.kill("s1").unwrap();
        assert!(!m.is_alive("s1"));
    }

    #[test]
    fn terminar_sesion_inexistente_devuelve_error() {
        let mut m = PtyManager::new();
        assert!(m.kill("no-existe").is_err());
    }

    #[test]
    fn puede_escribir_input_a_sesion_activa() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        assert!(m.write("s1", "ls\n").is_ok());
    }

    #[test]
    fn escribir_a_sesion_muerta_devuelve_error() {
        let mut m = PtyManager::new();
        m.spawn("s1", "bash").unwrap();
        m.kill("s1").unwrap();
        assert!(m.write("s1", "ls\n").is_err());
    }

    #[test]
    fn escribir_a_sesion_inexistente_devuelve_error() {
        let mut m = PtyManager::new();
        assert!(m.write("no-existe", "ls\n").is_err());
    }
}
