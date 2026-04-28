# Aurora

Un workspace construido para que humanos e IA trabajen juntos — no un IDE con IA pegada encima, sino un entorno compartido donde ambos operan como co-usuarios del mismo espacio.

## Concepto

La mayoría de los IDEs tratan a la IA como un feature adicional. Aurora invierte esto: la conversación con Claude es la interfaz principal, y todo lo demás — terminales, editor, navegador, base de conocimiento — aparece desde ahí cuando se necesita.

El objetivo es un workspace rápido, manejado por teclado, donde nunca tengas que salir para obtener contexto, correr código, previsualizar una página, o saber qué tan cerca estás de reventar la ventana de contexto.

## Paneles

Los paneles se invocan bajo demanda y se cierran cuando no se necesitan:

- **Claude** — sesión de Claude Code, siempre presente
- **Terminal** — una o dos instancias PTY
- **Editor** — editor de código ligero con syntax highlighting (Tree-sitter)
- **Boreal** — navegador WebKit embebido para previsualizar trabajo web
- **Saturno** — grafo interactivo de la base de conocimiento del proyecto
- **Mission Telemetry** — stats en tiempo real: uso de tokens, medidor de contexto, indicador de degradación, gestión de conversaciones

## Navegación

- `Cmd + Flecha` — moverse entre paneles / fullscreen temporal
- `Opt + Número` — saltar a subtab específica
- `Opt + Flecha` — moverse entre subtabs secuencialmente

## Mission Telemetry

Observabilidad de tu sesión con Claude:

- Medidor de ventana de contexto (qué tan llena está, no solo cuando colapsa)
- Indicador de degradación de contexto (gradual, no binario)
- Aviso de compactación antes de que colapse automáticamente
- Conteo aproximado de tokens por conversación
- Gráficas de uso en el tiempo
- Comandos: `/compact`, `/clear`, nueva sesión

Los tokens se cuentan localmente con un tokenizador — Aurora lleva la cuenta de manera independiente sin depender del output de Claude Code.

## Saturno

Una base de conocimiento en Markdown que vive en el workspace. Memoria de largo plazo del proyecto: features, decisiones de arquitectura, herramientas, post-mortems de bugs. Navegable como un grafo interactivo D3.js renderizado dentro de Boreal.

No es una wiki para humanos. Es un archivo de referencia para el agente — para que las sesiones arranquen con contexto cargado, no desde cero.

## Stack

- **Tauri** (Rust + WebKit) — nativo en macOS y Linux
- **Frontend** — React, MVVM
- **Terminal** — PTY via backend en Rust
- **Navegador** — WKWebView (macOS) / WebKitGTK (Linux), sin dependencia de Chromium
- **Tokenizador** — conteo local de tokens, sin llamadas a la API para telemetría

## Plataformas

- macOS (principal)
- Linux (planeado)

## Estado

Planeación temprana. Todavía no corre nada.
