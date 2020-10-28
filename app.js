function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const vue = Vue.createApp({
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMsgs: []
        };
    },
    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            this.recordLog('player', 'attack', attackValue);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            this.recordLog('monster', 'attack', attackValue);
        },
        specialAttackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            this.recordLog('player', 'special attack', attackValue);
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;
            }
            this.recordLog('player', 'heal', healValue);
            this.attackPlayer();
        },
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.currentRound = 0;
            this.winner = null;
            this.logMsgs = [];
        },
        surrender() {
            this.winner = 'monster';
        },
        recordLog(who, what, value) {
            this.logMsgs.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    },
    computed: {
        monsterBarStyle() {
            if (this.monsterHealth < 0) {
                return { width: '0%' };
            }
            return { width: this.monsterHealth + '%' };
        },
        playerBarStyle() {
            if (this.playerHealth < 0) {
                return { width: '0%' };
            }
            return { width: this.playerHealth + '%' };
        },
        ruleToUseSpecialAttack() {
            return this.currentRound % 3 !== 0;
        },
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // A Draw
                this.winner = 'draw';
            } else if (value <= 0) {
                // player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // A Draw
                this.winner = 'draw';
            } else if (value <= 0) {
                // Monster lost
                this.winner = 'player';
            }
        }
    }
});

vue.mount('#game');