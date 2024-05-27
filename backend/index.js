"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
const uuid_1 = require("uuid");
dotenv.config();
const client = new pg_1.Client({
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
    user: process.env.PGUSER,
});
client.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), "dist")));
//authenticate middleware
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.token === "") {
            return res.status(401).send("Du måste vara inloggad");
        }
        const tokenInUse = req.body.token;
        const result = yield client.query("SELECT * FROM tokens");
        const existingTokens = result.rows.map((row) => row.token);
        if (!existingTokens.includes(tokenInUse)) {
            return res.status(401).send("Ogiltig token.");
        }
        const tokensTable = result.rows;
        let user = 0;
        for (let i = 0; i < tokensTable.length; i++) {
            if (tokensTable[i].token === tokenInUse) {
                user = tokensTable[i].account_id;
            }
        }
        req.user = user;
        // console.log("Användare: " + user + " godkänd.");
        next();
    });
}
//render
//skapa konto
app.post("/create-account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    //avsluta direkt om eamil inte skickas med
    if (req.body.email === undefined || req.body.email === "") {
        return res.status(400).send("Email måste skickas med.");
    }
    //avsluta direkt om lösenord inte skickas med
    if (req.body.password === undefined || req.body.password === "") {
        return res.status(400).send("Lösenord måste skickas med.");
    }
    //lägg till kontot i databasen
    try {
        yield client.query("INSERT INTO accounts (email, password) VALUES ($1, $2)", [req.body.email, req.body.password]);
    }
    catch (error) {
        console.error("Konto kunde inte skapas.");
        return res.status(400).send("Fel vid inmatning till databasen.");
    }
    //skapa token så att användaren loggas in vid skapandes av kontot
    const token = (0, uuid_1.v4)();
    //hämta alla konton från databasen
    const accounts = (yield client.query("SELECT * FROM accounts"))
        .rows;
    //lägg till token i databasen
    yield client.query("INSERT INTO tokens (account_id, token) VALUES ($1, $2)", [
        getAccountId(req.body.email, accounts),
        token,
    ]);
    //skicka token till frontend för att sätta den som cookie
    res.status(200).send({ token: token });
}));
//logga in
//verifiera inloggningen geonom att kolla så att email och lösenord stämmer överens med datan som finns i databasen
function verifyLogin(email, password, accounts) {
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email === email && accounts[i].password === password) {
            return true;
        }
    }
    return false;
}
//eftersom 'authenticate middleware' bara kan användas när man redan är inloggad så behövs denna funktion för att få fram användarens id
function getAccountId(email, accounts) {
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email === email) {
            return accounts[i].id;
        }
    }
    return null;
}
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //avsluta direkt om email inte skickas med
    if (req.body.email === undefined) {
        return res.status(400).send("Email måste skickas med.");
    }
    //avsluta direkt om lösenord inte skickas med
    if (req.body.password === undefined) {
        return res.status(400).send("Lösenord måste skickas med.");
    }
    //avsluta direkt om token inte skickas med
    if (req.body.token === undefined) {
        return res.status(400).send("Token måste skickas med.");
    }
    //hämta alla konton från databasen
    const accounts = (yield client.query("SELECT * FROM accounts"))
        .rows;
    //verifiera inloggningen
    if (verifyLogin(req.body.email, req.body.password, accounts)) {
        try {
            yield client.query("INSERT INTO tokens (account_id, token) VALUES ($1, $2)", [getAccountId(req.body.email, accounts), req.body.token]);
        }
        catch (error) {
            return res.status(400).send("Fel vid inmatning till databas");
        }
        res.status(200).send("Du är inloggad.");
        console.log("Inloggad med token: " + req.body.token);
    }
    else {
        //om inloggnigen inte kunde verifieras skickas statuskod 401
        res.status(401).send("Inloggning misslyckades.");
    }
}));
//logga ut
//här används 'authenticate middleware' för att kolla så att det är en använadre som inloggad
app.post("/logout", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query("DELETE FROM tokens WHERE token=$1", [req.body.token]);
    }
    catch (error) {
        console.error("Misslyckades med att ta bort token från databas.");
    }
    console.log("Token som blev utloggad: " + req.body.token);
    res.status(200).send("OK");
}));
//delete-account
app.delete("/delete-account", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query("DELETE FROM accounts WHERE id=$1", [req.body.id]);
    }
    catch (error) {
        console.error("Kunde inte ta bort konto.");
    }
    res.send("Konto borttaget.");
}));
//hämta användares uppgifter
app.post("/user", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield client.query("SELECT id, email, created FROM accounts WHERE id=$1", [
        req.user,
    ])).rows;
    res.send(user);
}));
//kolla om bokningen som görs redan finns, (förhindra dubbelbokningar)
function ifBookingAlreadyExist(accountId, teeTimeId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = {
                text: "SELECT * FROM booked_times WHERE account_id = $1 AND tee_time_id = $2",
                values: [accountId, teeTimeId],
            };
            const result = yield client.query(query);
            if (result.rowCount === 0) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (error) {
            console.error("Fel vid kontroll av bokningar:");
            throw error;
        }
    });
}
//boka tid
app.post("/book-tee-time", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //kolla så att bokningen inte existerar
    try {
        const bookingExists = yield ifBookingAlreadyExist(req.user, req.body.id);
        if (bookingExists) {
            console.log("Bokningen finns redan.");
            //om bokningen finns, avsluta med statuskod 400
            res.status(400).send();
        }
        else {
            //lägg till bokningen i databasen
            try {
                yield client.query("INSERT INTO booked_times (account_id, tee_time_id) VALUES ($1, $2)", [req.user, req.body.id]);
            }
            catch (error) {
                console.error("Gick inte att registrera tid i databasen.");
            }
            //när bokningen har gjorts så måste open_slots uppdateras, detta görs genom att först hämta alla rader för den bokade tiden
            const query = {
                text: "SELECT * FROM booked_times WHERE  tee_time_id = $1",
                values: [req.body.id],
            };
            const result = yield client.query(query);
            //med if garanteras att rowcount inte är null, sedan subtraheras antalet rader med 4 för att få fram antalet lediga plater
            if (result && result.rowCount) {
                const updatedSlots = 4 - result.rowCount;
                console.log(updatedSlots);
                //slutligen uppdateras open_slots i databasen
                try {
                    yield client.query("UPDATE tee_times SET open_slots = $1 WHERE id = $2", [updatedSlots, req.body.id]);
                }
                catch (error) {
                    console.error("Kunde inte uppdatera open_slots");
                }
                return res.status(201).send();
            }
            //else
        }
    }
    catch (error) {
        console.error("Fel vid hantering av bokning:", error);
    }
    res.send();
}));
//hämta bokade tider
app.post("/booked-times", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //skapa variabel och lägg i tidernas id
    const usersBookedTimesId = (yield client.query("SELECT tee_time_id FROM booked_times WHERE account_id = $1", [req.user])).rows;
    //skapa variabel till de bokade tiderna
    let usersBookedTimes = [];
    //loop för att pusha in använarens bokade tider i variablen 'usersBookedTimes'
    for (let i = 0; i < usersBookedTimesId.length; i++) {
        usersBookedTimes.push(yield (yield client.query("SELECT id, TO_CHAR(time, 'YYYY-MM-DD HH24:MI') AS times_string, open_slots FROM tee_times WHERE id = $1 ORDER BY id", [usersBookedTimesId[i].tee_time_id])).rows[0]);
    }
    //skicka användarens bokade tider
    res.send(usersBookedTimes);
}));
//avboka tid
app.post("/cancel", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.user);
    // console.log(req.body.teeTimeId);
    //ta bort den bokade tiden från databasen
    try {
        yield client.query("DELETE FROM booked_times WHERE account_id=$1 AND tee_time_id=$2", [req.user, req.body.teeTimeId]);
        //skapa variable för att updatera 'open_slots' värdet och addera 1 eftersom det nu blev en plats ledig
        const updatedSlots = (yield client.query("SELECT open_slots FROM tee_times WHERE id=$1", [
            req.body.teeTimeId,
        ])).rows[0].open_slots + 1;
        //ändra 'open_slots' värdet i databasen
        yield client.query("UPDATE tee_times SET open_slots=$1 WHERE id=$2", [
            updatedSlots,
            req.body.teeTimeId,
        ]);
    }
    catch (error) { }
    res.send();
}));
app.get("/dates", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //hämta alla tiders datum och spara dem i 'dates'
    const dates = (yield client.query("SELECT TO_CHAR(time, 'YYYY-MM-DD') AS day_string FROM tee_times ORDER BY id")).rows;
    //plocka ut värdena i alla objekt
    const datesValue = dates.map((item) => item.day_string);
    //ta bort alla dubbletter så att det bara finns ett av varje datum.
    const uniqueDatesValue = Array.from(new Set(datesValue));
    // console.log(uniqueDatesValue);
    //skicka arrayen med datumen
    res.send(uniqueDatesValue);
}));
//hämta tider till dagen som efterfrågas
app.post("/times-by-date", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //om inget datum skickas med i 'req.body.date' så avslutas anropet
    if (req.body.date === null) {
        return res.status(400).send;
    }
    console.log(req.body);
    //hämta tider till den dagen som efterfrågas
    const times = (yield client.query("SELECT id, TO_CHAR(time, 'YYYY-MM-DD HH24:MI') AS times_string, open_slots FROM tee_times WHERE DATE(time) = $1 ORDER BY id;", [req.body.date])).rows;
    //skicka tiderna
    res.send(times);
}));
app.listen(3000, () => {
    console.log("Redo på http://localhost:3000/");
});
//# sourceMappingURL=index.js.map