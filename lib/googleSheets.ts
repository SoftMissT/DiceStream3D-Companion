// lib/googleSheets.ts
import { google } from 'googleapis';

let sheetsClient: any | null = null;
let sheetsInitializationError: string | null = null;

const getSheetsClient = () => {
    if (sheetsClient) return sheetsClient;
    if (sheetsInitializationError) throw new Error(sheetsInitializationError);

    try {
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

        if (!privateKey || !clientEmail) {
            throw new Error('As variáveis de ambiente do Google Service Account (GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL) não estão configuradas.');
        }

        const auth = new google.auth.JWT(
            clientEmail,
            undefined,
            privateKey,
            ['https://www.googleapis.com/auth/spreadsheets.readonly']
        );

        sheetsClient = google.sheets({ version: 'v4', auth });
        console.log('Cliente Google Sheets inicializado com sucesso.');
        return sheetsClient;
    } catch (error: any) {
        sheetsInitializationError = error.message;
        console.error('Erro ao inicializar cliente Google Sheets:', sheetsInitializationError);
        throw new Error(`Serviço de Whitelist (Google Sheets) indisponível: ${sheetsInitializationError}`);
    }
};

export const isUserWhitelisted = async (userId: string): Promise<boolean> => {
    try {
        const client = getSheetsClient();
        const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
        const sheetName = process.env.GOOGLE_WHITELIST_SHEET_NAME;

        if (!spreadsheetId || !sheetName) {
            throw new Error('As variáveis de ambiente da planilha (GOOGLE_SPREADSHEET_ID, GOOGLE_WHITELIST_SHEET_NAME) não estão configuradas.');
        }

        const response = await client.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`, // Assumindo que os IDs estão na coluna A
        });

        const rows = response.data.values;
        if (rows) {
            // Flatten the array of arrays and check for the user ID
            return rows.flat().includes(userId);
        }

        return false;
    } catch (error: any) {
        console.error("Erro ao verificar whitelist do usuário:", error.message);
        // Em caso de erro (ex: planilha não encontrada), consideramos que o usuário não está na whitelist por segurança.
        return false;
    }
};