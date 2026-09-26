// Roda uma vez quando o servidor Node sobe: agenda a manutenção automática.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startMaintenance } = await import("./lib/maintenance");
    startMaintenance();
  }
}
