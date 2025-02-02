// Executa os jobs necessários para manutenção do Banco de Dados

import cron from 'node-cron'

import fs from "fs";
import moment from 'moment';
import path from "path";
const jobsDirectory = path.resolve("./api/v1/jobs");

// Função para carregar dinamicamente os jobs
const loadJobs = async () => {
    const jobFiles = fs.readdirSync(jobsDirectory).filter(file => file.endsWith(".js"));
    const jobs = [];

    for (const file of jobFiles) {
        const job = await import(`./jobs/${file}`);
        jobs.push(job.default);
    }

    return jobs;
};

const initJobs = () => {
    cron.schedule("*/5 * * * *", async () => {
        console.log("🔄 Executando jobs...");

        const jobs = await loadJobs();
        for (const job of jobs) {
            try {
                await job();
            } catch (error) {
                console.error("Erro ao executar job:", error);
            }
        }

        console.log(`✅ Jobs concluídos! (${moment().format("DD/MM/YYYY - HH:mm")})`);

    });
}

export default initJobs