use std::collections::{HashMap, HashSet};

#[derive(Debug, PartialEq, Clone)]
pub enum NodeCategory {
    Features,
    Architecture,
    Tools,
    Components,
    Incidents,
    Meetings,
}

#[derive(Debug, Clone)]
pub struct KbNode {
    pub id: String,
    pub filename: String,
    pub title: String,
    pub category: NodeCategory,
    pub description: String,
    pub links: Vec<String>,
    pub is_active: bool,
}

pub struct KbParser;

impl KbParser {
    pub fn parse_frontmatter(content: &str) -> Option<HashMap<String, String>> {
        let content = content.trim_start();
        if !content.starts_with("---") {
            return None;
        }
        let rest = &content[3..];
        let end = rest.find("---")?;
        let body = &rest[..end];

        let mut map = HashMap::new();
        for line in body.lines() {
            let line = line.trim();
            if line.is_empty() {
                continue;
            }
            if let Some((key, value)) = line.split_once(':') {
                map.insert(key.trim().to_string(), value.trim().to_string());
            }
        }

        if map.is_empty() {
            None
        } else {
            Some(map)
        }
    }

    pub fn extract_links(content: &str) -> Vec<String> {
        let mut seen = HashSet::new();
        let mut links = Vec::new();

        let mut rest = content;
        while let Some(start) = rest.find("](") {
            let after_bracket = &rest[start + 2..];
            if let Some(end) = after_bracket.find(')') {
                let url = &after_bracket[..end];
                if !url.starts_with("http://") && !url.starts_with("https://") && !url.is_empty() {
                    if seen.insert(url.to_string()) {
                        links.push(url.to_string());
                    }
                }
                rest = &after_bracket[end + 1..];
            } else {
                break;
            }
        }

        links
    }

    pub fn extract_title(content: &str) -> Option<String> {
        for line in content.lines() {
            let line = line.trim();
            if let Some(title) = line.strip_prefix("# ") {
                return Some(title.trim().to_string());
            }
        }
        None
    }

    pub fn detect_category(filename: &str) -> NodeCategory {
        if filename.starts_with("features/") {
            NodeCategory::Features
        } else if filename.starts_with("architecture/") {
            NodeCategory::Architecture
        } else if filename.starts_with("tools/") {
            NodeCategory::Tools
        } else if filename.starts_with("incidents/") {
            NodeCategory::Incidents
        } else if filename.starts_with("meetings/") {
            NodeCategory::Meetings
        } else {
            NodeCategory::Components
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn extrae_titulo_de_h1() {
        let md = "# Mi Documento\n\nContenido aquí";
        assert_eq!(KbParser::extract_title(md), Some("Mi Documento".to_string()));
    }

    #[test]
    fn titulo_sin_h1_devuelve_none() {
        let md = "Sin título aquí\n\nSolo texto plano";
        assert_eq!(KbParser::extract_title(md), None);
    }

    #[test]
    fn extrae_el_primer_h1_si_hay_varios() {
        let md = "# Primero\n\n# Segundo";
        assert_eq!(KbParser::extract_title(md), Some("Primero".to_string()));
    }

    #[test]
    fn extrae_links_markdown() {
        let md = "Ver [arquitectura](architecture.md) y [herramientas](tools.md)";
        let links = KbParser::extract_links(md);
        assert!(links.contains(&"architecture.md".to_string()));
        assert!(links.contains(&"tools.md".to_string()));
    }

    #[test]
    fn sin_links_devuelve_vec_vacio() {
        let md = "Texto sin ningún link";
        assert!(KbParser::extract_links(md).is_empty());
    }

    #[test]
    fn ignora_links_externos_http() {
        let md = "Ver [esto](https://example.com) y [local](local.md)";
        let links = KbParser::extract_links(md);
        assert!(!links.contains(&"https://example.com".to_string()));
        assert!(links.contains(&"local.md".to_string()));
    }

    #[test]
    fn links_duplicados_se_deduplicados() {
        let md = "Ver [doc](archivo.md) y otra vez [doc](archivo.md)";
        let links = KbParser::extract_links(md);
        assert_eq!(links.iter().filter(|l| *l == "archivo.md").count(), 1);
    }

    #[test]
    fn parsea_frontmatter_valido() {
        let md = "---\ntitle: Mi Doc\ntype: feature\n---\n\nContenido";
        let fm = KbParser::parse_frontmatter(md);
        assert!(fm.is_some());
        let map = fm.unwrap();
        assert_eq!(map.get("title"), Some(&"Mi Doc".to_string()));
        assert_eq!(map.get("type"), Some(&"feature".to_string()));
    }

    #[test]
    fn sin_frontmatter_devuelve_none() {
        let md = "# Título\n\nSin frontmatter";
        assert!(KbParser::parse_frontmatter(md).is_none());
    }

    #[test]
    fn frontmatter_incompleto_devuelve_none() {
        let md = "---\ntitle: Sin cierre";
        assert!(KbParser::parse_frontmatter(md).is_none());
    }

    #[test]
    fn detecta_categoria_features_por_ruta() {
        assert_eq!(KbParser::detect_category("features/trade_in.md"), NodeCategory::Features);
    }

    #[test]
    fn detecta_categoria_architecture_por_ruta() {
        assert_eq!(KbParser::detect_category("architecture/decisions.md"), NodeCategory::Architecture);
    }

    #[test]
    fn detecta_categoria_tools_por_ruta() {
        assert_eq!(KbParser::detect_category("tools/deploy.md"), NodeCategory::Tools);
    }

    #[test]
    fn detecta_categoria_incidents_por_ruta() {
        assert_eq!(KbParser::detect_category("incidents/2026-01-01_bug.md"), NodeCategory::Incidents);
    }

    #[test]
    fn archivo_en_raiz_sin_categoria_devuelve_components() {
        assert_eq!(KbParser::detect_category("archivo.md"), NodeCategory::Components);
    }
}
