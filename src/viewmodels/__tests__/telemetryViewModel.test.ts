import { describe, it, expect, beforeEach } from "vitest";
import { createTelemetryViewModel } from "../telemetryViewModel";

const CLAUDE_CONTEXT_WINDOW = 200_000;

describe("TelemetryViewModel", () => {
  let vm: ReturnType<typeof createTelemetryViewModel>;

  beforeEach(() => {
    vm = createTelemetryViewModel(CLAUDE_CONTEXT_WINDOW);
  });

  // --- Estado inicial ---
  it("inicia con 0 tokens", () => {
    expect(vm.getUsage().totalTokens).toBe(0);
  });

  it("inicia con 0% de contexto usado", () => {
    expect(vm.getUsage().contextWindowUsedPercent).toBe(0);
  });

  it("inicia sin degradación de contexto", () => {
    expect(vm.isDegrading()).toBe(false);
  });

  it("inicia sin aviso de compactación", () => {
    expect(vm.needsCompactionWarning()).toBe(false);
  });

  // --- Conteo de tokens ---
  it("registra tokens de mensaje de usuario", () => {
    vm.addMessage("user", 100);
    expect(vm.getUsage().inputTokens).toBe(100);
  });

  it("registra tokens de respuesta de asistente", () => {
    vm.addMessage("assistant", 200);
    expect(vm.getUsage().outputTokens).toBe(200);
  });

  it("el total es la suma de input y output", () => {
    vm.addMessage("user", 100);
    vm.addMessage("assistant", 200);
    expect(vm.getUsage().totalTokens).toBe(300);
  });

  it("múltiples mensajes acumulan tokens", () => {
    vm.addMessage("user", 100);
    vm.addMessage("assistant", 150);
    vm.addMessage("user", 80);
    expect(vm.getUsage().totalTokens).toBe(330);
  });

  // --- Porcentaje de contexto ---
  it("calcula correctamente el porcentaje de contexto usado", () => {
    vm.addMessage("user", 20_000);
    expect(vm.getUsage().contextWindowUsedPercent).toBeCloseTo(10, 1);
  });

  it("100k tokens = 50% de contexto en ventana de 200k", () => {
    vm.addMessage("user", 100_000);
    expect(vm.getUsage().contextWindowUsedPercent).toBeCloseTo(50, 1);
  });

  // --- Degradación de contexto ---
  it("activa degradación al superar el umbral (50%)", () => {
    vm.addMessage("user", 101_000);
    expect(vm.isDegrading()).toBe(true);
  });

  it("no activa degradación por debajo del umbral", () => {
    vm.addMessage("user", 99_000);
    expect(vm.isDegrading()).toBe(false);
  });

  // --- Aviso de compactación ---
  it("activa aviso de compactación al superar el 80%", () => {
    vm.addMessage("user", 161_000);
    expect(vm.needsCompactionWarning()).toBe(true);
  });

  it("no activa aviso por debajo del 80%", () => {
    vm.addMessage("user", 159_000);
    expect(vm.needsCompactionWarning()).toBe(false);
  });

  // --- Reset ---
  it("reset limpia todos los tokens", () => {
    vm.addMessage("user", 1000);
    vm.reset();
    expect(vm.getUsage().totalTokens).toBe(0);
  });

  it("reset limpia el porcentaje de contexto", () => {
    vm.addMessage("user", 100_000);
    vm.reset();
    expect(vm.getUsage().contextWindowUsedPercent).toBe(0);
  });

  it("reset desactiva aviso de compactación", () => {
    vm.addMessage("user", 161_000);
    vm.reset();
    expect(vm.needsCompactionWarning()).toBe(false);
  });

  // --- Historial de sesiones ---
  it("puede registrar múltiples sesiones", () => {
    vm.addMessage("user", 100);
    vm.startNewSession();
    vm.addMessage("user", 200);
    expect(vm.getSessionHistory()).toHaveLength(2);
  });

  it("nueva sesión reinicia el conteo de la sesión activa", () => {
    vm.addMessage("user", 100);
    vm.startNewSession();
    expect(vm.getUsage().totalTokens).toBe(0);
  });

  it("el historial acumula tokens de sesiones anteriores", () => {
    vm.addMessage("user", 100);
    vm.startNewSession();
    expect(vm.getSessionHistory()[0].tokenUsage.totalTokens).toBe(100);
  });
});
