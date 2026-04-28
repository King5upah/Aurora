pub struct Tokenizer;

impl Tokenizer {
    pub fn new() -> Self {
        Self
    }

    /// Aproximación BPE-like: divide por espacios y puntuación, ~4 chars por token.
    pub fn count(&self, text: &str) -> usize {
        if text.is_empty() {
            return 0;
        }

        let mut tokens = 0usize;
        let mut char_count = 0usize;

        for ch in text.chars() {
            if ch.is_whitespace() {
                if char_count > 0 {
                    tokens += (char_count / 4).max(1);
                    char_count = 0;
                }
            } else if ch.is_ascii_punctuation() {
                if char_count > 0 {
                    tokens += (char_count / 4).max(1);
                    char_count = 0;
                }
                tokens += 1;
            } else {
                char_count += ch.len_utf8();
            }
        }

        if char_count > 0 {
            tokens += (char_count / 4).max(1);
        }

        tokens
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn string_vacia_tiene_cero_tokens() {
        let t = Tokenizer::new();
        assert_eq!(t.count(""), 0);
    }

    #[test]
    fn una_palabra_tiene_un_token_aproximado() {
        let t = Tokenizer::new();
        assert!(t.count("hola") >= 1);
    }

    #[test]
    fn texto_mas_largo_tiene_mas_tokens_que_texto_corto() {
        let t = Tokenizer::new();
        let corto = t.count("hola");
        let largo = t.count("hola mundo esto es una oración más larga con varias palabras");
        assert!(largo > corto);
    }

    #[test]
    fn snippet_de_rust_produce_tokens() {
        let t = Tokenizer::new();
        let code = "fn main() { println!(\"hola\"); }";
        assert!(t.count(code) > 0);
    }

    #[test]
    fn snippet_de_typescript_produce_tokens() {
        let t = Tokenizer::new();
        let code = "const x: number = 42; export default x;";
        assert!(t.count(code) > 0);
    }

    #[test]
    fn emojis_producen_tokens() {
        let t = Tokenizer::new();
        assert!(t.count("🚀🌟💻") > 0);
    }

    #[test]
    fn caracteres_unicode_producen_tokens() {
        let t = Tokenizer::new();
        assert!(t.count("こんにちは世界") > 0);
    }

    #[test]
    fn solo_espacios_tiene_pocos_o_cero_tokens() {
        let t = Tokenizer::new();
        assert!(t.count("     ") <= 2);
    }

    #[test]
    fn texto_de_mil_palabras_da_resultado_razonable() {
        let t = Tokenizer::new();
        let texto = "palabra ".repeat(1000);
        let tokens = t.count(&texto);
        assert!(tokens > 500 && tokens < 2000);
    }

    #[test]
    fn mismo_texto_siempre_da_mismo_resultado() {
        let t = Tokenizer::new();
        let texto = "el zorro rápido salta sobre el perro perezoso";
        assert_eq!(t.count(texto), t.count(texto));
    }

    #[test]
    fn texto_duplicado_tiene_aproximadamente_el_doble_de_tokens() {
        let t = Tokenizer::new();
        let base = "hola mundo esto es una prueba";
        let doble = format!("{} {}", base, base);
        let tokens_base = t.count(base);
        let tokens_doble = t.count(&doble);
        let ratio = tokens_doble as f64 / tokens_base as f64;
        assert!(ratio > 1.5 && ratio < 2.5);
    }
}
