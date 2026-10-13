// BGM変数
let bgmAudio = null;
let gameBgmAudio = null;
let bgmStarted = false;
let bgmVolume = 0.5; // BGMデフォルト音量50%
let sfxVolume = 0.5; // 効果音デフォルト音量50%
let broadcastStarted = false; // 配信開始フラグ
let selectedPlayer1Character = null; // プレイヤー1の選択されたキャラクター
let selectedPlayer2Character = null; // プレイヤー2の選択されたキャラクター
let currentSelectionPlayer1 = 1; // プレイヤー1の現在選択中のキャラクター（初期値：甘狼このみ）
let currentSelectionPlayer2 = 1; // プレイヤー2の現在選択中のキャラクター（初期値：甘狼このみ）
let commentHistory = []; // コメント履歴（コメントとタイムスタンプ）
const characterNames = {
  1: '甘狼このみ',
  2: '音ノ乃のの',
  3: 'あくび・でもんすぺーど',
  4: '音ノ瀬らこ',
  5: 'ゆらぎゆら',
  6: '小廻こま',
  7: '雨夜リズ',
  8: '眠雲ツクリ',
  9: '虹深゜ぬふ'
};

// 効果音再生関数
function playSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.volume = sfxVolume;
  audio.play().catch(e => console.log('効果音再生エラー:', e));
}

// ゲットメッセージ表示関数
function showGetMessage(number) {
  const getMessage = document.getElementById('get-message');
  
  // 数字からキャラクター名に変換（数値・文字列両対応）
  const characterNames = {
    1: '甘狼このみ',
    2: '音ノ乃のの',
    3: 'あくび・でもんすぺーど',
    4: '音ノ瀬らこ',
    5: 'ゆらぎゆら',
    6: '小廻こま',
    7: '雨夜リズ',
    8: '眠雲ツクリ',
    9: '虹深゜ぬふ'
  };
  
  // キャラクターごとの色（カード背景色に合わせる）
  const characterColors = {
    1: '#c0edf0', // 甘狼このみ
    2: '#b4b1df', // 音ノ乃のの
    3: '#b2405d', // あくび・でもんすぺーど
    4: '#ffdf5c', // 音ノ瀬らこ
    5: '#9BB7E9', // ゆらぎゆら
    6: '#ffab57', // 小廻こま
    7: '#63a4a4', // 雨夜リズ
    8: '#DFB5FF', // 眠雲ツクリ
    9: '#F5B7B7' // 虹深゜ぬふ
  };
  
  // 数値に変換して検索
  const num = parseInt(number);
  const characterName = characterNames[num] || num;
  const characterColor = characterColors[num] || '#FFFFFF';
  
  getMessage.innerHTML = `<div style="text-align: center; line-height: 1.2;">
    <span style="color: ${characterColor}; font-size: 1.2em; font-weight: bold;">${characterName}</span><br>
    <span style="color: #000000; font-size: 0.8em; font-weight: bold;">ゲット！</span>
  </div>`;
  getMessage.style.position = 'fixed';
  getMessage.style.top = '50%';
  getMessage.style.left = '50%';
  getMessage.style.transform = 'translate(-50%, -50%)';
  getMessage.style.zIndex = '1000';
  getMessage.classList.remove('hidden');

  // ゲットメッセージ表示中はカード操作をロック
  lock = true;

  // 全カードのクリックを無効化
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(c => c.style.pointerEvents = 'none');

  // 2秒後に非表示
  setTimeout(() => {
    getMessage.classList.add('hidden');
    // ロックを解除
    lock = false;
    // カードのクリックを再有効化
    allCards.forEach(c => c.style.pointerEvents = '');
  }, 2000);
}

// キャラクターカードめくり機能
function initCharacterCard() {
  const characterCard = document.querySelector('.character-simple-card');
  if (characterCard) {
    characterCard.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  }
}

// デコレーションカードめくり機能
function initDecorationCard() {
  // クリック機能を削除 - プレイヤー1のカードとして制御
}

// プレイヤー1のデコレーションカードを裏返す
function showPlayer1DecorationCard() {
  const decorationCard = document.querySelector('.decoration-left-center');
  if (decorationCard) {
    decorationCard.classList.add('flipped');
    
    // 5秒後に表に戻す
    setTimeout(() => {
      decorationCard.classList.remove('flipped');
    }, 3000);
  }
}

// プレイヤー1のデコレーションカードを泣き顔にする
function showPlayer1SadFace() {
  const decorationCard = document.querySelector('.decoration-left-center');
  const happyFace = decorationCard.querySelector('.card-back');
  const sadFace = decorationCard.querySelector('.card-sad');
  
  if (decorationCard && happyFace && sadFace) {
    // 笑顔を非表示、泣き顔を表示
    happyFace.style.display = 'none';
    sadFace.style.display = 'flex';
    
    // カードをひっくり返す
    decorationCard.classList.add('flipped');
    
    // 5秒後に元に戻す
    setTimeout(() => {
      decorationCard.classList.remove('flipped');
      setTimeout(() => {
        happyFace.style.display = 'flex';
        sadFace.style.display = 'none';
      }, 600); // アニメーション時間を待つ
    }, 3000);
  }
}

// プレイヤー2のデコレーションカードを裏返す
function showPlayer2DecorationCard() {
  const decorationCard = document.querySelector('.decoration-right-center');
  if (decorationCard) {
    decorationCard.classList.add('flipped');
    
    // 5秒後に表に戻す
    setTimeout(() => {
      decorationCard.classList.remove('flipped');
    }, 3000);
  }
}

// プレイヤー2のデコレーションカードを泣き顔にする
function showPlayer2SadFace() {
  const decorationCard = document.querySelector('.decoration-right-center');
  const happyFace = decorationCard.querySelector('.card-back');
  const sadFace = decorationCard.querySelector('.card-sad');
  
  if (decorationCard && happyFace && sadFace) {
    // 笑顔を非表示、泣き顔を表示
    happyFace.style.display = 'none';
    sadFace.style.display = 'flex';
    
    // カードをひっくり返す
    decorationCard.classList.add('flipped');
    
    // 5秒後に元に戻す
    setTimeout(() => {
      decorationCard.classList.remove('flipped');
      setTimeout(() => {
        happyFace.style.display = 'flex';
        sadFace.style.display = 'none';
      }, 600); // アニメーション時間を待つ
    }, 3000);
  }
}

// ゲーム結果時のデコレーションカード表示関数
function showGameResultFaces() {
  // 勝敗を判定
  let winner = null;
  let loser = null;
  
  if (player1Score > player2Score) {
    winner = 1;
    loser = 2;
  } else if (player2Score > player1Score) {
    winner = 2;
    loser = 1;
  }
  
  // プレイヤー1のデコレーションカード
  const decorationCard1 = document.querySelector('.decoration-left-center');
  const happyFace1 = decorationCard1.querySelector('.card-back');
  const sadFace1 = decorationCard1.querySelector('.card-sad');
  
  // プレイヤー2のデコレーションカード
  const decorationCard2 = document.querySelector('.decoration-right-center');
  const happyFace2 = decorationCard2.querySelector('.card-back');
  const sadFace2 = decorationCard2.querySelector('.card-sad');
  
  if (winner && loser) {
    // 勝ったプレイヤー：笑顔を永久表示
    if (winner === 1) {
      if (decorationCard1 && happyFace1 && sadFace1) {
        sadFace1.style.display = 'none';
        happyFace1.style.display = 'flex';
        decorationCard1.classList.add('flipped');
      }
    } else {
      if (decorationCard2 && happyFace2 && sadFace2) {
        sadFace2.style.display = 'none';
        happyFace2.style.display = 'flex';
        decorationCard2.classList.add('flipped');
      }
    }
    
    // 負けたプレイヤー：泣き顔を永久表示
    if (loser === 1) {
      if (decorationCard1 && happyFace1 && sadFace1) {
        happyFace1.style.display = 'none';
        sadFace1.style.display = 'flex';
        decorationCard1.classList.add('flipped');
      }
    } else {
      if (decorationCard2 && happyFace2 && sadFace2) {
        happyFace2.style.display = 'none';
        sadFace2.style.display = 'flex';
        decorationCard2.classList.add('flipped');
      }
    }
  } else {
    // 引き分けの場合：2人とも笑顔を永久表示
    if (decorationCard1 && happyFace1 && sadFace1) {
      sadFace1.style.display = 'none';
      happyFace1.style.display = 'flex';
      decorationCard1.classList.add('flipped');
    }
    
    if (decorationCard2 && happyFace2 && sadFace2) {
      sadFace2.style.display = 'none';
      happyFace2.style.display = 'flex';
      decorationCard2.classList.add('flipped');
    }
  }
}

// 汎用メッセージ表示関数
function showGeneralMessage(text, duration = 2000) {
  const message = document.getElementById('general-message');
  
  message.innerHTML = text;
  message.classList.remove('hidden');
  
  // 改行時の行間を調整
  message.style.lineHeight = '1.3';
  
  // メッセージ表示中はカードクリックを無効にする
  messageLock = true;
  
  // durationが0の場合は永続表示（消さない）
  if (duration > 0) {
    setTimeout(() => {
      message.classList.add('hidden');
      // メッセージ非表示後に1秒待ってからロック解除
      setTimeout(() => {
        messageLock = false;
      }, 1000);
    }, duration);
  }
}

// スキル確認表示関数
function showSkillConfirm(text, onConfirm) {
  const confirmDiv = document.getElementById('skill-confirm');
  const textDiv = confirmDiv.querySelector('.skill-confirm-text');
  textDiv.textContent = text;
  confirmDiv.classList.remove('hidden');
  
  // コールバックをグローバル変数に保存
  window.skillConfirmCallback = onConfirm;
}

// スキル確認結果処理関数
function confirmSkill(result) {
  const confirmDiv = document.getElementById('skill-confirm');
  confirmDiv.classList.add('hidden');
  
  if (window.skillConfirmCallback) {
    window.skillConfirmCallback(result);
    window.skillConfirmCallback = null;
  }
}

// キャラクター名と画像ファイル名のマッピング
const characterImages = {
  1: '甘狼このみ',
  2: '音ノ乃のの',
  3: 'あくび・でもんすぺーど',
  4: '音ノ瀬らこ',
  5: 'ゆらぎゆら',
  6: '小廻こま',
  7: '雨夜リズ',
  8: '眠雲ツクリ',
  9: '虹深゜ぬふ'
};

// キャラクターごとの色
const characterColors = {
  1: '#c0edf0', // 甘狼このみ
  2: '#b4b1df', // 音ノ乃のの
  3: '#b2405d', // あくび・でもんすぺーど
  4: '#ffdf5c', // 音ノ瀬らこ
  5: '#9BB7E9', // ゆらぎゆら
  6: '#ffab57', // 小廻こま
  7: '#63a4a4', // 雨夜リズ
  8: '#DFB5FF', // 眠雲ツクリ
  9: '#F5B7B7'  // 虹深゜ぬふ
};

// キャラクターごとのデコレーションカード位置とサイズ設定
const characterCardSettings = {
  1: { // このみ
    normalOffset: { x: -1, y: 2 },
    happyOffset: { x: 0, y: 8.5 },
    sadOffset: { x: -8, y: 2 },
    scale: 1.03
  },
  2: { // のの
    normalOffset: { x: -7, y: -5 },
    happyOffset: { x: -5, y: 0 },
    sadOffset: { x: -12, y: -5 },
    scale: 1.01
  },
  3: { // あくび
    normalOffset: { x: 0, y: 0 },
    happyOffset: { x: 0, y: 8.5 },
    sadOffset: { x: -5, y: 0 },
    scale: 0.95
  },
  4: { // らこ
    normalOffset: { x: 0, y: -4 },
    happyOffset: { x: 0, y: 2.5 },
    sadOffset: { x: 0, y: -4 },
    scale: 1.05
  },
  5: { // ゆらぎ
    normalOffset: { x: 0, y: 8 },
    happyOffset: { x: 0, y: 15 },
    sadOffset: { x: 0, y: 8 },
    scale: 0.95
  },
  6: { // こま
    normalOffset: { x: -2, y: 2 },
    happyOffset: { x: -2, y: 10.5 },
    sadOffset: { x: -7, y: 2 },
    scale: 0.95
  },
  7: { // リズ
    normalOffset: { x: 0, y: -1 },
    happyOffset: { x: 0, y: 5 },
    sadOffset: { x: -5, y: -1 },
    scale: 1.03
  },
  8: { // ツクリ
    normalOffset: { x: -2, y: -3 },
    happyOffset: { x: -2, y: 4 },
    sadOffset: { x: -7, y: -3 },
    scale: 1.06
  },
  9: { // ぬふ
    normalOffset: { x: -1, y: -6 },
    happyOffset: { x: -1, y: 1 },
    sadOffset: { x: -6, y: -6 },
    scale: 1.04
  }
};

// デコレーションカードの画像を更新する関数
function updateDecorationCard(characterId, position) {
  const characterName = characterImages[characterId];
  if (!characterName) return;
  
  const cardSelector = position === 'left' ? '.decoration-left-center' : '.decoration-right-center';
  const card = document.querySelector(cardSelector);
  if (card) {
    // キャラクターごとの設定を取得
    const settings = characterCardSettings[characterId];
    if (!settings) return;
    
    // 通常顔の画像を更新
    const normalImage = card.querySelector('.normal-face .decoration-image');
    if (normalImage) {
      normalImage.src = `./images/${characterName}_N.png`;
      normalImage.alt = `${characterName}通常`;
      // 位置とサイズを適用
      normalImage.style.transform = `translate(${settings.normalOffset.x}px, ${settings.normalOffset.y}px) scale(${settings.scale})`;
    }
    
    // 笑顔の画像を更新
    const happyImage = card.querySelector('.happy-face .decoration-image');
    if (happyImage) {
      happyImage.src = `./images/${characterName}_H.png`;
      happyImage.alt = `${characterName}笑顔`;
      // 位置とサイズを適用
      happyImage.style.transform = `translate(${settings.happyOffset.x}px, ${settings.happyOffset.y}px) scale(${settings.scale})`;
    }
    
    // 泣き顔の画像を更新
    const sadImage = card.querySelector('.sad-face .decoration-image');
    if (sadImage) {
      sadImage.src = `./images/${characterName}_S.png`;
      sadImage.alt = `${characterName}泣き顔`;
      // 位置とサイズを適用
      sadImage.style.transform = `translate(${settings.sadOffset.x}px, ${settings.sadOffset.y}px) scale(${settings.scale})`;
    }
  }
}

// プレイヤー名表示更新関数
function updatePlayerNameDisplay(player, characterName) {
  const nameElement = document.getElementById(`player${player}-name`);
  if (nameElement && characterName) {
    nameElement.textContent = characterName;
  }
}

// 選択カードの表示を更新する関数
function updateSelectionCard(player, characterId) {
  const characterName = characterImages[characterId];
  if (!characterName) return;

  const cardSelector = player === 1 ? '.selection-left' : '.selection-right';
  const card = document.querySelector(cardSelector);
  if (card) {
    // キャラクターごとの設定を取得
    const settings = characterCardSettings[characterId];
    if (!settings) return;

    // 通常顔の画像を更新
    const normalImage = card.querySelector('.normal-face .decoration-image');
    if (normalImage) {
      normalImage.src = `./images/${characterName}_N.png`;
      normalImage.alt = `${characterName}通常`;
      // 位置とサイズを適用
      normalImage.style.transform = `translate(${settings.normalOffset.x}px, ${settings.normalOffset.y}px) scale(${settings.scale})`;
    }

    // 笑顔の画像を更新
    const happyImage = card.querySelector('.happy-face .decoration-image');
    if (happyImage) {
      happyImage.src = `./images/${characterName}_H.png`;
      happyImage.alt = `${characterName}笑顔`;
      // 位置とサイズを適用
      happyImage.style.transform = `translate(${settings.happyOffset.x}px, ${settings.happyOffset.y}px) scale(${settings.scale})`;
    }

    // 泣き顔の画像を更新
    const sadImage = card.querySelector('.sad-face .decoration-image');
    if (sadImage) {
      sadImage.src = `./images/${characterName}_S.png`;
      sadImage.alt = `${characterName}泣き顔`;
      // 位置とサイズを適用
      sadImage.style.transform = `translate(${settings.sadOffset.x}px, ${settings.sadOffset.y}px) scale(${settings.scale})`;
    }
  }
}

// 前のキャラクターに切り替え
function prevCharacter(player) {
  if (player === 1) {
    currentSelectionPlayer1 = currentSelectionPlayer1 > 1 ? currentSelectionPlayer1 - 1 : 9;
    updateSelectionCard(1, currentSelectionPlayer1);
  } else if (player === 2) {
    currentSelectionPlayer2 = currentSelectionPlayer2 > 1 ? currentSelectionPlayer2 - 1 : 9;
    updateSelectionCard(2, currentSelectionPlayer2);
  }
  if (netMode !== 'local' && player === myPlayerNum) sendMyChar();
}

// 次のキャラクターに切り替え
function nextCharacter(player) {
  if (player === 1) {
    currentSelectionPlayer1 = currentSelectionPlayer1 < 9 ? currentSelectionPlayer1 + 1 : 1;
    updateSelectionCard(1, currentSelectionPlayer1);
  } else if (player === 2) {
    currentSelectionPlayer2 = currentSelectionPlayer2 < 9 ? currentSelectionPlayer2 + 1 : 1;
    updateSelectionCard(2, currentSelectionPlayer2);
  }
  if (netMode !== 'local' && player === myPlayerNum) sendMyChar();
}

// キャラクターを確定
function decideCharacter(event, player) {
  if (player === 1) {
    selectedPlayer1Character = currentSelectionPlayer1;
    const characterName = characterImages[selectedPlayer1Character];
    updatePlayerNameDisplay(1, characterName);
    // デコレーションカードの画像を更新
    updateSelectionCard(1, selectedPlayer1Character);

    // 選択カードを2秒間裏返して笑顔を表示
    const selectionCard = document.querySelector('.selection-left');
    if (selectionCard) {
      selectionCard.classList.add('flipped');
      setTimeout(() => {
        selectionCard.classList.remove('flipped');
      }, 2000);
    }

    // ナビゲーションボタンを無効化
    const player1NavBtns = document.querySelectorAll('.player1-selection .nav-btn');
    player1NavBtns.forEach(btn => btn.disabled = true);

    // 決定ボタンを緑色にして無効化
    if (event && event.target) {
      event.target.classList.add('decided');
      event.target.disabled = true;
    }
  } else if (player === 2) {
    selectedPlayer2Character = currentSelectionPlayer2;
    const characterName = characterImages[selectedPlayer2Character];
    updatePlayerNameDisplay(2, characterName);
    // デコレーションカードの画像を更新
    updateSelectionCard(2, selectedPlayer2Character);

    // 選択カードを2秒間裏返して笑顔を表示
    const selectionCard = document.querySelector('.selection-right');
    if (selectionCard) {
      selectionCard.classList.add('flipped');
      setTimeout(() => {
        selectionCard.classList.remove('flipped');
      }, 2000);
    }

    // ナビゲーションボタンを無効化
    const player2NavBtns = document.querySelectorAll('.player2-selection .nav-btn');
    player2NavBtns.forEach(btn => btn.disabled = true);

    // 決定ボタンを緑色にして無効化
    if (event && event.target) {
      event.target.classList.add('decided');
      event.target.disabled = true;
    }
  }

  // オンライン対戦では自分の選択を相手へ送信
  if (netMode !== 'local' && player === myPlayerNum) sendMyChar(true);

  // ゲームスタートボタンの状態を更新
  refreshStartBtn();
}

// キャラクター選択を初期化
function initCharacterSelection() {
  currentSelectionPlayer1 = 1;
  currentSelectionPlayer2 = 1;
  updateSelectionCard(1, 1);
  updateSelectionCard(2, 1);
}

// プレイヤー1キャラクター選択関数
function selectCharacter(player, characterId) {
  if (player === 1) {
    selectedPlayer1Character = characterId;
    
    // プレイヤー1のボタンの選択状態と無効化をリセット
    const player1Buttons = document.querySelectorAll('.player1-character-selection .character-btn-small');
    player1Buttons.forEach(btn => {
      btn.classList.remove('selected');
      btn.disabled = false;
    });
    
    // 選択されたボタンのスタイルを変更
    player1Buttons.forEach(btn => {
      if (parseInt(btn.dataset.character) === characterId) {
        btn.classList.add('selected');
        btn.disabled = true;
      }
    });
    
    // デコレーションカードの画像を更新
    updateDecorationCard(characterId, 'left');
    
    // プレイヤー名表示を更新
    const characterName = characterImages[characterId];
    updatePlayerNameDisplay(1, characterName);
    
    // 「ミリプロタレントをえらんでください！」のテキストを消す
    const characterMessage = document.getElementById('character-message');
    if (characterMessage) {
      characterMessage.style.display = 'none';
    }
    
    // ゲームスタートボタンを有効化（両方のプレイヤーが選択した場合のみ）
    const startBtn = document.getElementById('start-btn');
    if (selectedPlayer1Character && selectedPlayer2Character) {
      startBtn.disabled = false;
    } else {
      startBtn.disabled = true;
    }
    
  } else if (player === 2) {
    selectedPlayer2Character = characterId;
    
    // プレイヤー2のボタンの選択状態と無効化をリセット
    const player2Buttons = document.querySelectorAll('.player2-character-selection .character-btn-small');
    player2Buttons.forEach(btn => {
      btn.classList.remove('selected');
      btn.disabled = false;
    });
    
    // 選択されたボタンのスタイルを変更
    player2Buttons.forEach(btn => {
      if (parseInt(btn.dataset.character) === characterId) {
        btn.classList.add('selected');
        btn.disabled = true;
      }
    });
    
    // デコレーションカードの画像を更新
    updateDecorationCard(characterId, 'right');
    
    // プレイヤー名表示を更新
    const characterName = characterImages[characterId];
    updatePlayerNameDisplay(2, characterName);
    
    // ゲームスタートボタンを有効化
    const startBtn = document.getElementById('start-btn');
    if (selectedPlayer1Character && selectedPlayer2Character) {
      startBtn.disabled = false;
    }
    
  }
}

// 配信開始関数
function startBroadcast() {
  if (!broadcastStarted) {
    broadcastStarted = true;

    // ゲームスタートボタンを無効化（キャラクター選択必須）
    const startBtn = document.getElementById('start-btn');
    startBtn.disabled = true;

    // キャラクター選択エリアを表示
    const characterSelections = document.querySelectorAll('.character-selection-container');
    characterSelections.forEach(selection => {
      selection.style.display = 'flex';
    });

    // キャラクター選択を初期化
    initCharacterSelection();

    // BGMを開始
    startBGM();

    // コメントを開始
    setTimeout(() => {
      console.log('配信開始：チャット開始');
      startChat();
    }, 1000);

    // 配信開始ボタンのテキストを変更
    const broadcastBtn = document.getElementById('broadcast-btn');
    broadcastBtn.textContent = 'LIVE';
    broadcastBtn.style.background = 'linear-gradient(to bottom, #28a745 0%, #20c997 100%)';

    console.log('配信を開始しました');
  }
}

// BGM開始関数
function startBGM() {
  if (!bgmStarted) {
    bgmAudio = new Audio('./bgm/Mini.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.3;
    bgmAudio.play().catch(e => console.log('BGM再生エラー:', e));
    bgmStarted = true;
  }
}

// ゲームBGM開始関数
function startGameBGM() {
  gameBgmAudio = new Audio('./bgm/gamebiyori.mp3');
  gameBgmAudio.loop = true;
  gameBgmAudio.volume = 0.3;
  gameBgmAudio.play().catch(e => console.log('ゲームBGM再生エラー:', e));
}

// スタートゲーム関数
function startGame(event) {
  // イベント伝播を停止
  if (event) {
    event.stopPropagation();
  }

  // 配信が開始されているかチェック
  if (!broadcastStarted) {
    showGeneralMessage('まず配信を開始してください！', 2000);
    return;
  }

  if (netMode === 'guest') {
    showGeneralMessage('ホストが開始するのを<br>待っています…', 2000);
    return;
  }
  if (netMode === 'host') {
    if (!netConnected) {
      showGeneralMessage('相手がまだ接続していません', 2000);
      return;
    }
    // ホストがカードの並びと乱数シードを決めてゲストへ送る
    const c1 = selectedPlayer1Character || currentSelectionPlayer1;
    const c2 = remoteChar || 1;
    selectedPlayer1Character = c1;
    selectedPlayer2Character = c2;
    rngState = (Math.random() * 0x100000000) >>> 0;
    netSend({ t: 'start', deck: images.slice(), seed: rngState, chars: [c1, c2] });
  }

  beginMatch();
}

// 対局開始処理（ローカル/ホスト/ゲスト共通）
function beginMatch() {
  // ゲーム開始時にコメントを待機用に切り替え
  currentComments = waitingComments;
  gameStarted = true;
  firstCardClicked = false;
  console.log('ゲーム開始：待機用コメントに切り替え');
  
  // 選択されたキャラクターをプレイヤー名に反映
  if (selectedPlayer1Character) {
    const player1NameElement = document.querySelector('.player1-info .player-name');
    if (player1NameElement) {
      player1NameElement.textContent = characterNames[selectedPlayer1Character];

      // あくび・でもんすぺーどの場合のみフォントサイズを小さくする
      if (selectedPlayer1Character === 3) { // あくび・でもんすぺーど
        player1NameElement.style.fontSize = '1.25em';
      } else {
        player1NameElement.style.fontSize = ''; // デフォルトサイズに戻す
      }
    }

    // デコレーションカードを更新
    updateDecorationCard(selectedPlayer1Character, 'left');
  }

  if (selectedPlayer2Character) {
    const player2NameElement = document.querySelector('.player2-info .player-name');
    if (player2NameElement) {
      player2NameElement.textContent = characterNames[selectedPlayer2Character];

      // あくび・でもんすぺーどの場合のみフォントサイズを小さくする
      if (selectedPlayer2Character === 3) { // あくび・でもんすぺーど
        player2NameElement.style.fontSize = '1.25em';
      } else {
        player2NameElement.style.fontSize = ''; // デフォルトサイズに戻す
      }
    }

    // デコレーションカードを更新
    updateDecorationCard(selectedPlayer2Character, 'right');
  }
  
  // スタート画面BGMを停止
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio = null;
  }
  
  // スタート画面を非表示
  document.getElementById('start-screen').style.display = 'none';
  
  // ゲーム画面を表示
  document.getElementById('game-container').style.display = 'flex';
  
  // オンライン対戦では自分のプレイヤーに YOU バッジを付ける
  if (netMode !== 'local') {
    const myGroup = document.querySelector(myPlayerNum === 1 ? '.player1-group' : '.player2-group');
    if (myGroup) myGroup.classList.add('me');
  }

  // ゲームを初期化
  initializeGame();

  // ゲーム開始時に「0ペア！」を表示
  showInitialPairMessage();
  
  // ゲームBGMを開始
  startGameBGM();
}

// BGM再生関数（互換性のため残す）
function playBGM() {
  startBGM();
}

// ゲーム初期化関数
function initializeGame() {
  // ゲームの初期化処理
  updateScores();
  updateSkillButtons();
}

// 効果音再生関数
function playSound(soundType) {
  const audio = new Audio();
  
  switch(soundType) {
    case 'flip':
      audio.src = './sounds/card_is_taken.mp3';
      break;
    case 'shuffle':
      audio.src = './sounds/shuff.mp3';
      break;
    default:
      return;
  }
  
  audio.volume = sfxVolume;
  audio.play().catch(e => console.log('音声再生エラー:', e));
}

// ホームに戻る確認関数
function confirmGoHome() {
  // モーダルを表示
  const modal = document.getElementById('home-confirm-modal');
  modal.classList.remove('hidden');
}

// ホームに戻る関数
function goToHome() {
  location.reload();
}

// ゲーム終了時のタイトル画面遷移処理
function returnToTitleScreen() {
  // ゲーム変数をリセット
  gameStarted = false;
  broadcastStarted = false;
  selectedPlayer1Character = null;
  selectedPlayer2Character = null;
  firstCardClicked = false;
  currentPlayer = 1;
  player1Score = 0;
  player2Score = 0;
  blockedCards = [];
  extraTurn = false;
  blockingMode = false;
  pendingBlock = false;
  blockTargetPlayer = 0;
  pendingShuffle = false;
  activeSkills = {1: [], 2: []};
  pendingSkills = {1: null, 2: null};
  
  // ゲーム画面を非表示
  document.getElementById('game-container').style.display = 'none';
  
  // スタート画面を表示
  document.getElementById('start-screen').style.display = 'flex';
  
  // ゲームBGMを停止
  if (gameBgmAudio) {
    gameBgmAudio.pause();
    gameBgmAudio = null;
  }
  
  // BGMを再開
  startBGM();
  
  // 配信開始ボタンをリセット
  const broadcastBtn = document.getElementById('broadcast-btn');
  broadcastBtn.textContent = '配信開始';
  broadcastBtn.style.background = 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)';
  
  // ゲームスタートボタンを無効化
  const startBtn = document.getElementById('start-btn');
  startBtn.disabled = true;
  
  // キャラクター選択エリアを非表示
  const characterSelection1 = document.querySelector('.player1-character-selection');
  if (characterSelection1) {
    characterSelection1.style.display = 'none';
  }
  const characterSelection2 = document.querySelector('.player2-character-selection');
  if (characterSelection2) {
    characterSelection2.style.display = 'none';
  }
  
  // キャラクターメッセージを表示
  const characterMessage = document.getElementById('character-message');
  if (characterMessage) {
    characterMessage.style.display = 'block';
  }
}

// ホーム確認を閉じる関数
function closeHomeConfirm() {
  const modal = document.getElementById('home-confirm-modal');
  modal.classList.add('hidden');
}

let currentPlayer = 1;
let firstCard = null;
let lock = false;
let player1Score = 0;
let player2Score = 0;
let blockedCards = []; // ブロックされたカード情報 [cardIndex, blockingPlayer, turnsRemaining]
let extraTurn = false; // 追加手番フラグ
let blockingMode = false; // ブロックモードフラグ
let pendingBlock = false; // 手番終了後のブロック待ちフラグ
let blockTargetPlayer = 0; // ブロック対象のプレイヤー
let pendingShuffle = false; // 手番終了後のシャッフル待ちフラグ
let activeSkills = {1: [], 2: []}; // 各プレイヤーの使用済みスキル
let pendingSkills = {1: null, 2: null}; // 各プレイヤーの待機中スキル

const images = [];
for (let i = 1; i <= 9; i++) {
  images.push(i, i);
}
images.push(10, 10); // ミリちゃんカードを2枚追加（ペアになる）
images.sort(() => Math.random() - 0.5);

const board = document.getElementById("board");

// 盤面を構築する（オンライン対戦ではホストから受け取った並びで再構築する）
function buildBoard(imageList) {
  board.innerHTML = '';
  imageList.forEach((num, index) => {
  const card = document.createElement("div");
  card.className = "card";
  
  // カードに位置番号を設定（1から20）
  card.dataset.position = index + 1;
  
  // カード前面（表面）
  const cardFront = document.createElement("div");
  cardFront.className = "card-face card-front";
  cardFront.textContent = '';
  
  // カード裏面（表面）
  const cardBack = document.createElement("div");
  cardBack.className = "card-face card-back";
  cardBack.setAttribute("data-number", num);

  // マーク画像を設定
  const markImages = {
    1: './images/甘狼このみ_マーク.png',
    2: './images/音ノ乃のの_マーク.png',
    3: './images/あくび・でもんすぺーど_マーク.png',
    4: './images/音ノ瀬らこ_マーク.png',
    5: './images/ゆらぎゆら_マーク.png',
    6: './images/小廻こま_マーク.png',
    7: './images/雨夜リズ_マーク.png',
    8: './images/眠雲ツクリ_マーク.png',
    9: './images/虹深゜ぬふ_マーク.png',
    10: './images/ミリちゃん_N.png'
  };

  if (markImages[num]) {
    const img = document.createElement("img");
    img.src = markImages[num];

    // 甘狼このみ（1番）は画像を少し大きく
    if (num === 1) {
      img.style.width = "85%";
      img.style.height = "85%";
    } else if (num === 6) {
      // 小廻こま（6番）は画像を少し大きく
      img.style.width = "83%";
      img.style.height = "83%";
    } else if (num === 3) {
      // あくび・でもんすぺーど（3番）は画像を少し大きく
      img.style.width = "83%";
      img.style.height = "83%";
    } else if (num === 10) {
      // ミリちゃん（10番）は画像を大きく
      img.style.width = "90%";
      img.style.height = "90%";
    } else {
      img.style.width = "80%";
      img.style.height = "80%";
    }
    img.style.objectFit = "contain";

    // 甘狼このみ（1番）は少し左に
    if (num === 1) {
      img.style.marginLeft = "-2%";
      img.style.marginTop = "2%";
    }

    // 小廻こま（6番）は少し左に
    if (num === 6) {
      img.style.marginLeft = "-1.5%";
      img.style.marginTop = "1.5%";
    }

    // ゆらぎゆら（5番）はほんの少しだけ左に
    if (num === 5) {
      img.style.marginLeft = "-3%";
    }

    // あくび・でもんすぺーど（3番）はほんの少しだけ左下に
    if (num === 3) {
      img.style.marginLeft = "-3%";
      img.style.marginTop = "5.5%";
    }

    // 眠雲ツクリ（8番）は少し上に
    if (num === 8) {
      img.style.marginTop = "-3%";
    }

    cardBack.appendChild(img);
  }
  
  card.appendChild(cardFront);
  card.appendChild(cardBack);

  card.onclick = () => {
    if (netMode !== 'local') {
      // オンライン対戦:自分の手番のみ操作可能。受理される手だけを相手へ送信する
      if (!netConnected || currentPlayer !== myPlayerNum) return;
      if (!canClickCard(card, false)) return;
      netSend({ t: 'click', i: Array.from(board.children).indexOf(card) });
      doCardClick(card);
      return;
    }
    if (!canClickCard(card, false)) return;
    doCardClick(card);
  };

  board.appendChild(card);
  });
}
buildBoard(images);

// カードがクリック可能か判定する（副作用なし）。silent=false の時は拒否メッセージも表示する
function canClickCard(card, silent) {
  // ロック中、既に開いているカード、マッチ済みカードはクリック不可
  if (lock || card.classList.contains("open") || card.classList.contains("matched")) return false;

  // テキストメッセージ表示中はカードクリックを無効に
  const getMsg = document.getElementById('get-message');
  const outMsg = document.getElementById('out-message');
  const generalMsg = document.getElementById('general-message');
  const skillConfirm = document.getElementById('skill-confirm');

  if (!getMsg.classList.contains('hidden') ||
      !outMsg.classList.contains('hidden') ||
      !generalMsg.classList.contains('hidden') ||
      !skillConfirm.classList.contains('hidden') ||
      messageLock) {
    return false;
  }

  // ブロックされたカードは選択できない（ただしブロックモード時は除く）
  const cardIndex = Array.from(board.children).indexOf(card);
  const isBlocked = blockedCards.some(([idx, blockedPlayer, turns]) =>
    idx === cardIndex && currentPlayer === blockedPlayer && turns > 0
  );
  if (isBlocked && !blockingMode) {
    if (!silent) showGeneralMessage('このカードは<br>選択できません！');
    return false;
  }
  return true;
}

// カードクリックの実処理（ローカル/リモート共通）
function doCardClick(card) {
    // 最初のカードクリックでゲーム用コメントに切り替え
    if (gameStarted && !firstCardClicked) {
      currentComments = gameComments;
      firstCardClicked = true;
      console.log('最初のカードクリック：ゲーム用コメントに切り替え');
    }

    // 即座にロックをかけて連続クリックを防止
    lock = true;

    const cardIndex = Array.from(board.children).indexOf(card);
    const cardBackEl = card.querySelector('.card-back');

    // ブロックモードの場合（2枚めくり終わった後）
    if (blockingMode) {
      if (card.classList.contains("open")) {
        showGeneralMessage('表向きのカードはブロックできません！');
        lock = false; // ロックを解除
        return;
      }
      
      const blockingPlayer = currentPlayer === 1 ? 2 : 1;
      blockedCards.push([cardIndex, blockingPlayer, 1]);
      blockingMode = false;
      updateBlockDisplay();
      
      // サインスキル実行時に顔アイコンを表示
      // サインをしたプレイヤー（現在のプレイヤー）が嬉しい顔に
      if (currentPlayer === 1) {
        showPlayer1DecorationCard();
      } else {
        showPlayer2DecorationCard();
      }
      
      // 相手が悲しむ
      const opponentPlayer = currentPlayer === 1 ? 2 : 1;
      if (opponentPlayer === 1) {
        showPlayer1SadFace();
      } else {
        showPlayer2SadFace();
      }
      
      showGeneralMessage(`サインを描きました！`, 2000);
      
      // ブロック選択後、全カードのクリックを再有効化
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(c => c.style.pointerEvents = '');
      
      // pendingBlockをfalseに設定してサイン完了
      pendingBlock = false;
      
      // ブロック選択後、すぐに手番交代
      handleTurnChange();
      return;
    }

    card.classList.add("open");
    playSound('flip'); // カードめくり音

    if (!firstCard) {
      firstCard = card;
      const cardBack = card.querySelector('.card-back');
      const cardNumber = cardBack.getAttribute('data-number');
      
      // 1枚目がミリちゃんカード（10番）の場合
      if (cardNumber === '10') {
        // カード操作をロック
        lock = true;
        
        // 0.5秒後にミリちゃん画像メッセージを表示
        setTimeout(() => {
          const miriMessage = document.getElementById('miri-image-message');
          miriMessage.classList.remove('hidden');
          
          // めくったプレイヤーのデコレーションカードを泣き顔にする
          if (currentPlayer === 1) {
            showPlayer1SadFace();
          } else {
            showPlayer2SadFace();
          }
        }, 500);
        
        setTimeout(() => {
          card.classList.remove("open");
          firstCard = null;
          lock = false;
          const miriMessage = document.getElementById('miri-image-message');
          miriMessage.classList.add('hidden');
          
          // 待機中のスキルを処理してから手番交代
          handleMiriCardDraw();
        }, 2500);
        return;
      }
      
      lock = false; // 1枚目の場合はロックを解除して次のカードを選択可能に
    } else {
      lock = true;
      const firstCardBack = firstCard.querySelector('.card-back');
      const firstCardNumber = firstCardBack.getAttribute('data-number');
      const secondCardNumber = cardBackEl.getAttribute('data-number');

      // どちらかがミリちゃんカード（10番）の場合
      if (firstCardNumber === '10' || secondCardNumber === '10') {
        // 0.5秒後にミリちゃん画像メッセージを表示
        setTimeout(() => {
          const miriMessage = document.getElementById('miri-image-message');
          miriMessage.classList.remove('hidden');
          
          // めくったプレイヤーのデコレーションカードを泣き顔にする
          if (currentPlayer === 1) {
            showPlayer1SadFace();
          } else {
            showPlayer2SadFace();
          }
        }, 500);
        
        setTimeout(() => {
          card.classList.remove("open");
          firstCard.classList.remove("open");
          firstCard = null;
          lock = false;
          const miriMessage = document.getElementById('miri-image-message');
          miriMessage.classList.add('hidden');
          
          // 待機中のスキルを処理してから手番交代
          handleMiriCardDraw();
        }, 2500);
        return;
      }

      if (firstCardNumber === secondCardNumber) {
        // ペアが揃った場合 - 一致コメントに切り替え
        currentComments = matchComments;
        console.log('ペア一致：一致コメントに切り替え');
        
        // 既存の一致タイマーをクリア
        if (matchTimer) {
          clearTimeout(matchTimer);
        }
        
        // 7秒後にゲーム用コメントに戻す
        matchTimer = setTimeout(() => {
          currentComments = gameComments;
          console.log('7秒経過：ゲーム用コメントに戻す');
          matchTimer = null;
        }, 7000);
        
        if (currentPlayer === 1) {
          player1Score++;
          // プレイヤー1の場合、デコレーションカードを裏返す
          showPlayer1DecorationCard();
          // ペア成立時にプレイヤー1スコアを表示
          showPlayer1ScoreMessage();
        } else {
          player2Score++;
          // プレイヤー2の場合、デコレーションカードを裏返す
          showPlayer2DecorationCard();
          // ペア成立時にプレイヤー2スコアを表示
          showPlayer2ScoreMessage();
        }
        
        // ゲットメッセージを表示（カード除去の前に呼ぶ）
        const cardNumber = cardBackEl.getAttribute('data-number');
        const cardNum = parseInt(cardNumber);
        
        // ゲーム終了チェック（最後のペアかどうか）
        const remainingCardsBeforeRemoval = document.querySelectorAll(".card:not(.matched)");
        const isLastPair = remainingCardsBeforeRemoval.length === 2;
        
        if (cardNum >= 1 && cardNum <= 9) {
          showGetMessage(cardNum);
        } else if (cardNum === 10) {
          // ミリちゃんカードの場合は特別なメッセージ
          showGeneralMessage('ミリちゃんゲット！', 2000);
        }
        
        // ゲットメッセージ表示中はカード除去を待つ（最後のペアでもゲットメッセージを表示）
        const delay = 2000;
        setTimeout(() => {
          // すぐにカードを盤面から除去
          firstCard.classList.add("matched");
          card.classList.add("matched");
          updateScores();
          
          // ゲーム終了チェック
          const remainingCards = document.querySelectorAll(".card:not(.matched)");

          if (remainingCards.length === 0) {
            // 通常のゲーム終了（全カード除去）
            setTimeout(() => {
              currentComments = gameEndComments;

              if (matchTimer) {
                clearTimeout(matchTimer);
                matchTimer = null;
              }

              if (mismatchTimer) {
                clearTimeout(mismatchTimer);
                mismatchTimer = null;
              }
              console.log('ゲーム終了：全カード除去');
              const player1CharacterName = selectedPlayer1Character ? characterImages[selectedPlayer1Character] : null;
              const player2CharacterName = selectedPlayer2Character ? characterImages[selectedPlayer2Character] : null;
              const player1Color = selectedPlayer1Character ? characterColors[selectedPlayer1Character] : '#333';
              const player2Color = selectedPlayer2Character ? characterColors[selectedPlayer2Character] : '#333';
              if (player1Score > player2Score) {
                showGeneralMessage(`<span style="color: ${player1Color}; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.5em;">${player1CharacterName}</span><br><span style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.2em;">勝利！</span>`, 0);
              } else if (player2Score > player1Score) {
                showGeneralMessage(`<span style="color: ${player2Color}; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.5em;">${player2CharacterName}</span><br><span style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.2em;">勝利！</span>`, 0);
              } else {
                showGeneralMessage(`<span style="font-size: 1.3em;">引き分け！</span>`, 0);
              }
              showGameResultFaces(); // ゲーム結果の顔表示
            }, 2000);
          } else if (remainingCards.length === 2) {
            // 残り2枚がミリちゃんカードの場合は両方を表にしてから結果表示
            const cardNumbers = Array.from(remainingCards).map(card => {
              const cardBack = card.querySelector('.card-back');
              return cardBack.getAttribute('data-number');
            });
            
            if (cardNumbers.every(num => num === '10')) {
              // ミリちゃんカードをめくったタイミングでコメントを切り替え
              currentComments = gameEndComments;
              console.log('ゲーム終了：ミリちゃんカード2枚残り - コメント切り替え');
              
              if (matchTimer) {
                clearTimeout(matchTimer);
                matchTimer = null;
              }

              if (mismatchTimer) {
                clearTimeout(mismatchTimer);
                mismatchTimer = null;
              }
              
              // 両方のミリちゃんカードを表にする
              remainingCards.forEach(card => {
                // ブロックマークを削除
                const blockMark = card.querySelector('.block-mark');
                if (blockMark) {
                  blockMark.remove();
                }
                card.classList.add('open');
              });
              
              setTimeout(() => {
                const player1CharacterName = selectedPlayer1Character ? characterImages[selectedPlayer1Character] : null;
                const player2CharacterName = selectedPlayer2Character ? characterImages[selectedPlayer2Character] : null;
                const player1Color = selectedPlayer1Character ? characterColors[selectedPlayer1Character] : '#333';
                const player2Color = selectedPlayer2Character ? characterColors[selectedPlayer2Character] : '#333';
                if (player1Score > player2Score) {
                  showGeneralMessage(`<span style="color: ${player1Color}; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.5em;">${player1CharacterName}</span><br><span style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.2em;">勝利！</span>`, 0);
                } else if (player2Score > player1Score) {
                  showGeneralMessage(`<span style="color: ${player2Color}; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.5em;">${player2CharacterName}</span><br><span style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); font-size: 1.2em;">勝利！</span>`, 0);
                } else {
                  showGeneralMessage(`<span style="font-size: 1.3em;">引き分け！</span>`, 0);
                }
                showGameResultFaces(); // ゲーム結果の顔表示
              }, 2000);
            }
          } else {
            // 追加手番のチェック
            if (extraTurn) {
              extraTurn = false;

              // カードが削除された後に1.5秒間クリックを無効にする
              messageLock = true;
              setTimeout(() => {
                messageLock = false;
              }, 1500);

              // アンコールスキル実行時に顔アイコンを表示
              // 自分がアンコールを発動したら笑顔を表示
              if (currentPlayer === 1) {
                showPlayer1DecorationCard();
              } else {
                showPlayer2DecorationCard();
              }

              // 相手がアンコールを発動したら泣き顔を表示
              const opponentPlayer = currentPlayer === 1 ? 2 : 1;
              if (opponentPlayer === 1) {
                showPlayer1SadFace();
              } else {
                showPlayer2SadFace();
              }

              showGeneralMessage('アンコール！<br>もう１ターンプレイ！');

              // アンコールメッセージ表示時にブロックを解除
              for (let i = blockedCards.length - 1; i >= 0; i--) {
                const [cardIndex, blockedPlayer, turnsRemaining] = blockedCards[i];
                if (blockedPlayer === currentPlayer) { // 現在のプレイヤーのブロックを解除
                  blockedCards.splice(i, 1);
                }
              }

              // ブロック表示を更新
              updateBlockDisplay();
            } else {
              // カードが削除された後に1.5秒間クリックを無効にする
              messageLock = true;
              setTimeout(() => {
                messageLock = false;
              }, 1500);

              // 少し遅延してから2枚引いた後の処理（カード除去アニメーションを待つ）
              setTimeout(() => {
                handleAfterTwoCards();
              }, 300);
            }
          }
          
          firstCard = null;
          lock = false;
        }, 2000); // ゲットメッセージ表示時間と同じ2秒待つ
      } else {
        // ペアが揃わなかった場合 - 不一致コメントに切り替え
        currentComments = mismatchComments;
        console.log('ペア不一致：不一致コメントに切り替え');
        
        // 既存の不一致タイマーをクリア
        if (mismatchTimer) {
          clearTimeout(mismatchTimer);
        }
        
        // 1.5秒後にゲーム用コメントに戻す
        mismatchTimer = setTimeout(() => {
          currentComments = gameComments;
          console.log('1.5秒経過：ゲーム用コメントに戻す');
          mismatchTimer = null;
        }, 1500);
        
        setTimeout(() => {
          card.classList.remove("open");
          firstCard.classList.remove("open");
          firstCard = null;
          
          // カードが戻った後に1.5秒間クリックを無効にする
          messageLock = true;
          setTimeout(() => {
            messageLock = false;
          }, 1500);
          
          lock = false;
          
          // 追加手番のチェック
          if (extraTurn) {
            extraTurn = false;
            
            // アンコールスキル実行時に顔アイコンを表示
            // 自分がアンコールを発動したら笑顔を表示
            if (currentPlayer === 1) {
              showPlayer1DecorationCard();
            } else {
              showPlayer2DecorationCard();
            }
            
            // 相手がアンコールを発動したら泣き顔を表示
            const opponentPlayer = currentPlayer === 1 ? 2 : 1;
            if (opponentPlayer === 1) {
              showPlayer1SadFace();
            } else {
              showPlayer2SadFace();
            }
            
            showGeneralMessage('アンコール！<br>もうターンプレイ！');
          } else {
            // 2枚引いた後の処理
            handleAfterTwoCards();
          }
        }, 1200);
      }
    }
}

// スコア表示更新関数
function updateScores() {
  const player1ScoreElement = document.getElementById("player1-score");
  const player2ScoreElement = document.getElementById("player2-score");
  
  // スコアを直接表示（新しいHTML構造対応）
  if (player1ScoreElement) {
    player1ScoreElement.textContent = player1Score;
  }
  if (player2ScoreElement) {
    player2ScoreElement.textContent = player2Score;
  }
  
  // 残りカード枚数をチェック
  checkRemainingCards();
  
  // 手番表示の更新（アクティブターンのクラスを変更）
  const player1Group = document.querySelector(".player1-group");
  const player2Group = document.querySelector(".player2-group");
  
  // 全てのアクティブクラスを削除
  player1Group?.classList.remove("active-turn");
  player2Group?.classList.remove("active-turn");
  
  // 現在のプレイヤーにアクティブクラスを追加
  if (currentPlayer === 1) {
    player1Group?.classList.add("active-turn");
  } else {
    player2Group?.classList.add("active-turn");
  }
}

// 残りカード枚数チェック関数
function checkRemainingCards() {
  const cards = document.querySelectorAll('.card');
  const remainingCards = Array.from(cards).filter(card => 
    !card.classList.contains('matched')
  );
}

// ゲーム結果表示関数
function showGameResult() {
  let resultMessage = '';
  
  // ゲーム終了用コメントに切り替え（タイマーなしでずっと流し続ける）
  currentComments = gameEndComments;

  if (matchTimer) {
    clearTimeout(matchTimer);
    matchTimer = null;
  }

  if (mismatchTimer) {
    clearTimeout(mismatchTimer);
    mismatchTimer = null;
  }
  console.log('ゲーム結果表示：ゲーム終了用コメントに切り替え');
  
  if (player1Score > player2Score) {
    const player1CharacterName = selectedPlayer1Character ? characterImages[selectedPlayer1Character] : '甘狼このみ';
    const player1Color = selectedPlayer1Character ? characterColors[selectedPlayer1Character] : '#333';
    resultMessage = `Winner\n<span style="color: ${player1Color}; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">${player1CharacterName}</span><span style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">！</span>`;
  } else if (player2Score > player1Score) {
    const player2CharacterName = selectedPlayer2Character ? characterImages[selectedPlayer2Character] : '音ノ乃のの';
    const player2Color = selectedPlayer2Character ? characterColors[selectedPlayer2Character] : '#333';
    resultMessage = `Winner\n<span style="color: ${player2Color}; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">${player2CharacterName}</span><span style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">！</span>`;
  } else {
    resultMessage = `Draw`;
  }
  
  showGeneralMessage(resultMessage, 5000); // 5秒間表示
  
  // ゲーム終了処理
  lock = true; // ゲーム終了なのでロックを維持
}

// チャットコメント機能
const startScreenComments = [
  "きちゃ",
  "きちゃー", 
  "きちゃ!",
  "きちゃー！",
  "きちゃー！!",
  "楽しみ～",
  "間に合ったー",
  "こんにちは",
  "こんみりー",
  "こんみり～",
  "こんみりー！",
  "こんみり！",
  "まだかな～",
  "楽しみすぎる！",
  "楽しみやー",
  "始まってる？",
  "初見です",
  "初見です　こんみりー",
  "待機！",
  "待機っ！",
  "待機！！",
  "待機",
  "たいきっ！",
  "まだかなまだかな",
  "このときを待ってた",
  "待機",
  "待機！",
  "待機～",
  "待機っ！",
  "今日も楽しみ～",
  "わくわく",
  "わくわく！",
  "わくわく",
  "わくわく！",
  "こんみりー",
  "こんみり～",
  "こんみり！",
  "きちゃ",
  "きちゃー", 
  "きちゃ!",
  "きちゃー！",
  "きちゃー！!",
  "楽しみ～",
  "こんみりー",
  "こんみり～",
  "こんみりー！",
  "こんみり！",
  "こんみりー",
  "こんみり～",
  "こんみりっ！",
  "こんみりっ！",
  "こんみりー",
  "こんみり～",
  "こんみりー！",
  "こんみり！",
  "こんみりー",
  "こんみり～",
  "こんみりっ！",
  "こんみりっ！"
];

const gameComments = [
  "次は何が出るかな？",
  "むちゃ集中してる",
  "リミックスする？",
  "スキルもあるのか",
  "次こそは！",
  "意外とむずいのか",
  "スキル使うものありかも",
  "見ててハラハラする",
  "このペアどこやった？",
  "思い出せっ！",
  "次はいける！",
  "ここが勝負どころ",
  "頑張って！",
  "こんみり～",
  "こんみりっ！",
  "こんみりっ！",
  "こんみりー",
  "こんみり～",
  "こんみりー！",
  "こんみり！",
  "こんみりー",
  "こんみり～",
  "こんみりっ！",
  "こんみりっ！",
  "初見です",
  "こんみりー",
  "ふぁいと～",
  "ファイト！",
  "ファイト～",
  "ふぁいと!",
  "ファイトだ！",
  "どこにペアがあるかな",
  "初見です",
  "こんにちは",
  "奇跡起きろ",
  "２人ともがんばれ～"
];

const waitingComments = [
  "ゲームスタート！",
  "始まった始まった！",
  "はじまった",
  "はじまった！",
  "両方がんば",
  "どっちが勝つかな",
  "始まった！",
  "がんばれ！",
  "頑張れー",
  "がんばれ～！",
  "がんばれー！！",
  "注目の一手目！",
  "おっはじまってる",
  "間に合った～",
  "こんみり～",
  "こんみりっ！",
  "こんみりっ！",
  "こんみりー",
  "こんみり～",
  "こんみりー！",
  "こんみり！",
  "こんみりー",
  "こんみり～",
  "こんみりっ！",
  "こんみりっ！",
  "初見です",
  "こんみりー",
  "ふぁいと～",
  "ファイト！",
  "ファイト～",
  "ふぁいと!",
  "ファイトだ！",
  "最初の一手大事！",
  "初見です",
  "こんにちは",
  "奇跡起きろ",
  "そろったら神",
  "２人ともがんばれ～",
  "応援だ～",
];

const mismatchComments = [
  "あれー？",
  "違ったか！",
  "違うか～",
  "惜しい！",
  "次こそは！",
  "残念！",
  "うーん",
  "難しいな",
  "次だ次！",
  "大丈夫！",
  "諦めないで",
  "もういっちょ！",
  "もう１回！",
  "リカバリー！",
  "集中！",
  "あれっそこ違うんや",
  "あらまっ",
  "いやむず～",
  "しゃーなし",
  "どんまい",
  "ドンマイだ！",
  "流れを変えよう",
  "巻き返し！",
  "まだまだある",
  "メンタル大事",
  "気合いだ～！",
  "頑張れ！",
  "ファイト！",
  "負けないで～",
  "気合いだ～！",
  "おっと",
  "そのペアどこだ？",
  "まだいける！",
  "まだいけるよ！"

];

const matchComments = [
  "ナイス！",
  "ないすぅ～",
  "ないす！",
  "ナイスすぎ",
  "おっ！そろった！",
  "よし！",
  "揃った！",
  "すごい！",
  "すげー！",
  "お見事！",
  "天才か？",
  "神プレイ！",
  "やったね！",
  "最高！",
  "素晴らしい！",
  "見事！",
  "完璧！",
  "エクセレント！",
  "パーフェクト！",
  "ファンタスティック！",
  "アメージング！",
  "ワンダフル！",
  "グレート！",
  "グッド！",
  "よく覚えていたな",
  "うわっそこやったか",
  "記憶力すごっ",
  "この調子だ！"
];

const firstCard10Comments = [
  "ミリちゃん引いた！",
  "ミリちゃんだ！",
  "ミリちゃんがきた！",
  "ミリちゃんカード！",
  "引いてしまったか…",
  "ミリちゃんが来た！",
  "ミリちゃん出た！",
  "ミリちゃん引かれた！",
  "ミリちゃんだー！",
  "ミリちゃんが出現！",
  "ミリちゃんが現れた！",
  "く、くるっ",
  "ミリちゃんが現る！",
  "ミリちゃんが来たぞ！",
  "ミリちゃんの圧www",
  "あっ",
  "おっと",
  "あっwww",
  "www",
  "進捗確認は草",
  "進捗確認は草",
  "く、くるっ",
  "手番終了ー",
  "ドンマイ",
  "ドンマイすぎる",
  "ミリちゃん登場！"

];


const gameEndComments = [
  "おつかれさま！",
  "ゲームお疲れ様！",
  "見てて楽しかった！",
  "おつかれ！",
  "おつみり～",
  "再戦する？",
  "おもろかったwww",
  "おもろかった！",
  "ないすファイト!",
  "もう終わったのかー",
  "おもしろかった！",
  "おもしろかったwww",
  "勝利おめでとう！",
  "頑張ったね！",
  "よく頑張った！",
  "記憶力すごかった！",
  "おつかれ！",
  "おつみり～",
  "おつみりっ！",
　"おつミリ～",
  "おつミリ！",
  "おつかれ！",
  "おつみり～",
  "おつみりっ！",
　"おつミリ～",
  "おつミリ！",
  "おつかれ！",
  "おつみり～",
  "おつみりっ！",
　"おつミリ～",
  "おつミリ！"

];

let currentComments = startScreenComments; // 最初はスタート画面用コメント
let gameStarted = false; // ゲームが開始されたか
let firstCardClicked = false; // 最初のカードがクリックされたか
let mismatchTimer = null; // ペア不一致時のタイマー
let matchTimer = null; // ペア一致時のタイマー
let card10Timer = null; // 10カード時のタイマー
let first10Drawn = false; // はじめて10を引いたか
let messageLock = false; // メッセージ表示中のロックフラグ
let lastComment = ''; // 最後に表示したコメント

let chatInterval;

// チャットコメントを追加する関数
function addChatComment() {
  const chatContent = document.getElementById('chat-content');
  if (!chatContent) {
    console.log('chat-content要素が見つかりません');
    return;
  }
  
  // 同じコメントが連続で流れないようにする
  let randomComment;
  let attempts = 0;
  const currentTime = Date.now();
  
  // ゲーム終了時はコメント履歴の制限を無効化
  if (currentComments !== gameEndComments) {
    // 5秒以内に流れたコメントを履歴から削除
    commentHistory = commentHistory.filter(item => currentTime - item.timestamp < 5000);
    
    do {
      randomComment = currentComments[Math.floor(Math.random() * currentComments.length)];
      attempts++;
    } while ((randomComment === lastComment || commentHistory.some(item => item.comment === randomComment)) && attempts < 10);
  } else {
    // ゲーム終了時は通常のランダム選択
    do {
      randomComment = currentComments[Math.floor(Math.random() * currentComments.length)];
      attempts++;
    } while (randomComment === lastComment && attempts < 10);
  }
  
  lastComment = randomComment;
  
  // ゲーム終了時以外はコメントを履歴に追加
  if (currentComments !== gameEndComments) {
    commentHistory.push({ comment: randomComment, timestamp: currentTime });
  }
  
  const commentElement = document.createElement('div');
  commentElement.className = 'chat-comment';
  
  // タイムスタンプを生成
  const time = new Date().toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  commentElement.innerHTML = `
    <span class="comment-time">${time}</span>
    <span class="comment-text">${randomComment}</span>
  `;
  
  // コメント履歴のようなボックススタイル
  commentElement.style.position = 'absolute';
  commentElement.style.bottom = '10px';
  commentElement.style.left = '10px';
  commentElement.style.right = '10px';
  commentElement.style.background = 'rgba(120, 150, 255, 0.2)';
  commentElement.style.padding = '4px 8px';
  commentElement.style.marginBottom = '3px';
  commentElement.style.borderRadius = '6px';
  commentElement.style.borderLeft = '2px solid #7896ff';
  commentElement.style.fontSize = '14px';
  commentElement.style.fontFamily = "'cinecaption226', cursive, sans-serif";
  commentElement.style.color = '#ffffff';
  commentElement.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.8)';
  commentElement.style.opacity = '0';
  commentElement.style.transform = 'translateX(-20px)';
  commentElement.style.transition = 'all 0.3s ease';
  commentElement.style.zIndex = '10';
  commentElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
  commentElement.style.backdropFilter = 'blur(5px)';
  commentElement.style.display = 'flex';
  commentElement.style.alignItems = 'center';
  commentElement.style.justifyContent = 'flex-start';
  commentElement.style.whiteSpace = 'nowrap';
  commentElement.style.overflow = 'hidden';
  commentElement.style.textOverflow = 'ellipsis';
  
  chatContent.appendChild(commentElement);
  console.log('コメントを追加しました:', randomComment);
  
  // フェードインアニメーション
  setTimeout(() => {
    commentElement.style.opacity = '1';
    commentElement.style.transform = 'translateX(0)';
  }, 100);
  
  // 既存のコメントを上に移動
  const existingComments = chatContent.querySelectorAll('.chat-comment');
  existingComments.forEach((existingComment, index) => {
    if (existingComment !== commentElement) {
      const currentBottom = parseInt(existingComment.style.bottom) || 10;
      existingComment.style.bottom = (currentBottom + 35) + 'px';
      
      // ゲーム終了時以外は上に移動したコメントをフェードアウト（5行表示に対応）
      if (currentComments !== gameEndComments && currentBottom > 120) {
        existingComment.style.opacity = '0';
        setTimeout(() => {
          if (existingComment.parentNode) {
            existingComment.parentNode.removeChild(existingComment);
          }
        }, 300);
      }
    }
  });
  
  // このコメントも時間経過後に削除（ゲーム終了時は削除しない）
  if (currentComments !== gameEndComments) {
    setTimeout(() => {
      commentElement.style.opacity = '0';
      commentElement.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        if (commentElement.parentNode) {
          commentElement.parentNode.removeChild(commentElement);
        }
      }, 300);
    }, 8000);
  }
}

// チャットを開始する関数
function startChat() {
  console.log('チャット開始テスト');
  
  // テスト用の要素は削除
  // const testDiv = document.createElement('div');
  // ...（テストコードはコメントアウト）
  
  // 本来のチャット処理を有効化
  const chatContent = document.getElementById('chat-content');
  if (chatContent) {
    console.log('chat-contentが見つかりました');
    
    // 不規則な間隔で新しいコメントを追加
    function scheduleNextComment() {
      const randomInterval = Math.random() * 700 + 100; // 0.1秒〜0.8秒のランダム間隔
      chatInterval = setTimeout(() => {
        addChatComment();
        if (chatInterval) { // チャットが停止されていなければ次を予約
          scheduleNextComment();
        }
      }, randomInterval);
    }
    
    scheduleNextComment(); // 最初のコメントを予約
    console.log('不規則なチャットコメントの自動生成を開始しました');
  } else {
    console.log('chat-contentが見つかりません');
  }
}

// チャットを停止する関数
function stopChat() {
  if (chatInterval) {
    clearTimeout(chatInterval);
    chatInterval = null;
  }
}

// ゲーム開始時にチャットを開始
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM読み込み完了');
  
  // 配信開始ボタンがクリックされたときの処理
  const broadcastButton = document.getElementById('broadcast-btn');
  console.log('broadcast-btn:', broadcastButton);
  
  if (broadcastButton) {
    broadcastButton.addEventListener('click', function() {
      console.log('配信開始ボタンがクリックされました');
    });
  } else {
    console.log('broadcast-btnが見つかりません');
  }
});

// スキル番号を取得
function skillNumber(skillType) {
  return skillType === 'block' ? 1 : skillType === 'shuffle' ? 2 : skillType === 'extra' ? 3 : 0;
}

// スキル使用関数
function useSkill(player, skillType) {
  if (netMode !== 'local' && player !== myPlayerNum) return; // オンラインでは相手のスキルボタンは操作不可

  if (lock) { showGeneralMessage('カード処理中は<br>発動できません！'); return; }

  if (player !== currentPlayer) { showGeneralMessage('自分の手番でないと<br>発動できません！'); return; }

  if (firstCard) { showGeneralMessage('カード選択中は<br>発動できません！'); return; }

  const skillNum = skillNumber(skillType);

  // 既に使用済みのスキルかチェック
  if (activeSkills[player].includes(skillNum)) {
    return; // メッセージを表示せずに何もしない
  }

  // 既に待機中のスキルがあるかチェック
  if (pendingSkills[player] !== null) { showGeneralMessage('すでに他のスキルが<br>発動準備中です！'); return; }

  const skillNames = {block: 'サイン', shuffle: 'リミックス', extra: 'アンコール'};

  showSkillConfirm(`「${skillNames[skillType]}」を発動しますか？`, (confirmed) => {
    if (confirmed) {
      if (netMode !== 'local') netSend({ t: 'skill', s: skillType }); // 相手側でも同じ処理を実行させる
      activateSkill(player, skillType);
    }
  });
}

// リモート側でスキル発動を適用できるか判定（確認ダイアログは出さない）
function canApplyRemoteSkill(player, skillType) {
  const skillNum = skillNumber(skillType);
  return !lock && !firstCard && player === currentPlayer &&
    !activeSkills[player].includes(skillNum) && pendingSkills[player] === null;
}

// スキル発動の実処理（ローカル/リモート共通）
function activateSkill(player, skillType) {
  const skillNum = skillNumber(skillType);

  // スキルを使用済みに登録
  activeSkills[player].push(skillNum);
  pendingSkills[player] = skillNum;

  // ボタンを更新して使用済みスキルを灰色にする
  updateSkillButtons();

  switch(skillType) {
    case 'block':
      skillBlockCard();
      break;
    case 'shuffle':
      skillShuffleCards();
      break;
    case 'extra':
      skillExtraTurn();
      break;
  }
}

// スキル1：カードをブロックする
function skillBlockCard() {
  pendingBlock = true;
  blockTargetPlayer = currentPlayer === 1 ? 2 : 1;
  
  // 待機中スキルは手番交代までクリアしない（1ターンに1スキル制限のため）
}

// スキル2：カードをシャッフルする
function skillShuffleCards() {
  pendingShuffle = true;
}

// スキル3：追加手番
function skillExtraTurn() {
  extraTurn = true;
  
  // 待機中スキルは手番交代までクリアしない（1ターンに1スキル制限のため）
}

// ミリちゃんカードを引いた時の処理
function handleMiriCardDraw() {
  // ミリちゃんカード用コメントに切り替え
  currentComments = firstCard10Comments;
  console.log('ミリちゃんカード：ミリちゃん用コメントに切り替え');
  
  // 7秒後にゲーム用コメントに戻す
  setTimeout(() => {
    currentComments = gameComments;
    console.log('7秒経過：ゲーム用コメントに戻す');
  }, 7000);
  
  // ブロック待ち中の場合はブロックを実行
  if (pendingBlock) {
    // カードクリックを再有効化
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => c.style.pointerEvents = '');

    blockingMode = true;
    showGeneralMessage('カードを１枚<br>選択してください！');
  } else if (pendingShuffle) {
    // シャッフル待ち中の場合はシャッフルを実行
    showGeneralMessage('リミックスします！', 2000);

    // リミックススキル実行時に顔アイコンを表示
    if (currentPlayer === 1) {
      showPlayer1DecorationCard();
    } else {
      showPlayer2DecorationCard();
    }

    const opponentPlayer = currentPlayer === 1 ? 2 : 1;
    if (opponentPlayer === 1) {
      showPlayer1SadFace();
    } else {
      showPlayer2SadFace();
    }

    executeShuffle();
    pendingShuffle = false;
  } else if (extraTurn) {
    // 追加手番待ち中の場合はアンコールを実行
    extraTurn = false;
    messageLock = true;
    setTimeout(() => {
      messageLock = false;
    }, 1500);

    if (currentPlayer === 1) {
      showPlayer1DecorationCard();
    } else {
      showPlayer2DecorationCard();
    }

    const opponentPlayer = currentPlayer === 1 ? 2 : 1;
    if (opponentPlayer === 1) {
      showPlayer1SadFace();
    } else {
      showPlayer2SadFace();
    }

    showGeneralMessage('アンコール！<br>もうターンプレイ！');

    // アンコールメッセージ表示時にブロックを解除
    for (let i = blockedCards.length - 1; i >= 0; i--) {
      const [cardIndex, blockedPlayer, turnsRemaining] = blockedCards[i];
      if (blockedPlayer === currentPlayer) {
        blockedCards.splice(i, 1);
      }
    }

    updateBlockDisplay();
  } else {
    // 待機中のスキルがない場合は手番交代
    handleTurnChange();
  }
}

// 2枚引いた後の処理
function handleAfterTwoCards() {
  // ブロック待ち中の場合はブロックモードを有効化
  if (pendingBlock) {
    // ブロックモードの場合はカードクリックを再有効化
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => c.style.pointerEvents = '');

    blockingMode = true;
    // pendingBlockはfalseにしない（サイン実行のため）
    showGeneralMessage('カードを１枚<br>選択してください！');
  } else {
    // シャッフル待ち中の場合はカードが閉じた後にシャッフル
    if (pendingShuffle) {
      // カードが完全に閉じてからシャッフルを実行（1000ms + 100ms）
      setTimeout(() => {
        showGeneralMessage('リミックスします！', 2000);

        // リミックススキル実行時に顔アイコンを表示
        // 自分がリミックスを発動したら笑顔を表示
        if (currentPlayer === 1) {
          showPlayer1DecorationCard();
        } else {
          showPlayer2DecorationCard();
        }

        // 相手がリミックスを発動したら泣き顔を表示
        const opponentPlayer = currentPlayer === 1 ? 2 : 1;
        if (opponentPlayer === 1) {
          showPlayer1SadFace();
        } else {
          showPlayer2SadFace();
        }

        executeShuffle();
        pendingShuffle = false;
        // handleTurnChange()はexecuteShuffle()内で呼ばれるのでここでは呼ばない
      }, 1100);
    } else {
      // 通常の手番交代
      handleTurnChange();
    }
  }
}

// 手番交代処理
function handleTurnChange() {
  // スキルボタンを更新（相手の手番に移る直前）
  updateSkillButtons();
  
  // ロックを解除
  lock = false;
  
  // 全カードのクリックを再有効化
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(c => c.style.pointerEvents = '');
  
  // ブロックの残りターンを減らす（ただし、ブロックされたプレイヤーの手番が終わった後のみ）
  for (let i = blockedCards.length - 1; i >= 0; i--) {
    const [cardIndex, blockedPlayer, turnsRemaining] = blockedCards[i];
    if (blockedPlayer === currentPlayer) { // ちょうど手番が終わったプレイヤーのブロックを減らす
      blockedCards[i][2] = turnsRemaining - 1;
      // ターンが0になったらブロックを解除
      if (blockedCards[i][2] <= 0) {
        blockedCards.splice(i, 1);
      }
    }
  }
  
  // ブロック表示を更新
  updateBlockDisplay();
  
  // 待機中スキルをクリア
  pendingSkills[currentPlayer] = null;
  
  // 手番交代
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  
  // 手番表示を更新
  updateScores();
  
  // スキルボタン状態を更新
  updateSkillButtons();
}

// シャッフル実行関数
function executeShuffle() {
  const cards = document.querySelectorAll('.card');
  const board = document.getElementById('board');

  // シャッフル可能なカードを収集
  const shuffleTargets = [];

  cards.forEach((card, index) => {
    if (!card.classList.contains('open') && !card.classList.contains('matched')) {
      shuffleTargets.push({card, index});
    }
  });

  if (shuffleTargets.length < 2) {
    showGeneralMessage('シャッフルできるカードが2枚以上ありません！');
    return;
  }

  // 全ての位置を収集
  const allPositions = [];
  for (let i = 0; i < cards.length; i++) {
    allPositions.push(i);
  }

  // シャッフル対象カードの情報を収集（デザインは維持）
  const cardData = shuffleTargets.map(item => {
    const cardBack = item.card.querySelector('.card-back');
    const number = cardBack.getAttribute('data-number');
    return {
      card: item.card,
      originalIndex: item.index,
      number: number
    };
  });

  // 位置をシャッフル（空いている場所も含めてランダム配置）
  const availablePositions = [...allPositions];
  const selectedPositions = [];

  for (let i = 0; i < shuffleTargets.length; i++) {
    const randomIndex = Math.floor(gameRandom() * availablePositions.length);
    selectedPositions.push(availablePositions[randomIndex]);
    availablePositions.splice(randomIndex, 1);
  }

  // シャッフルアニメーション
  shuffleTargets.forEach(item => {
    item.card.style.transition = 'all 0.6s ease';
    item.card.style.transform = 'scale(0.1) rotate(180deg)';
    item.card.style.opacity = '0';
  });

  // アニメーション後に位置を変更
  setTimeout(() => {
    // ボードをクリアして再構築
    board.innerHTML = '';

    // 位置マップを作成
    const positionMap = new Map();
    shuffleTargets.forEach((item, i) => {
      positionMap.set(selectedPositions[i], item);
    });

    // 全てのカードを配置
    for (let pos = 0; pos < allPositions.length; pos++) {
      const targetItem = positionMap.get(pos);
      const originalCard = cards[pos];

      if (targetItem) {
        // シャッフル対象カードを新しい位置に配置
        board.appendChild(targetItem.card);
        targetItem.card.style.display = '';
        targetItem.card.classList.remove('open'); // 裏向きにする
      } else if (originalCard) {
        // シャッフル対象外のカードを元の位置に配置
        board.appendChild(originalCard);
        originalCard.style.display = '';
      }
    }

    // カードを再表示するアニメーション
    setTimeout(() => {
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(card => {
        if (!card.classList.contains('matched')) {
          card.style.transform = 'scale(1) rotate(0deg)';
          card.style.opacity = '1';
        }
      });
    }, 100);

    // アニメーションを元に戻す
    setTimeout(() => {
      const allCards = document.querySelectorAll('.card');
      allCards.forEach(card => {
        if (!card.classList.contains('matched')) {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.transition = '';
        }
      });

      playSound('shuffle');

      // シャッフル完了後に手番交代処理を呼ぶ
      handleTurnChange();
    }, 300);
  }, 600);
}

// ブロック表示更新関数
function updateBlockDisplay() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    // 既存のブロックマークを削除
    const existingBlock = card.querySelector('.block-mark');
    if (existingBlock) {
      existingBlock.remove();
    }
    
    // 新しいブロックマークを追加
    const blockInfo = blockedCards.find(([idx, blockedPlayer, turns]) => idx === index && turns > 0);
    if (blockInfo && !card.classList.contains('open')) {
      const blockMark = document.createElement('div');
      blockMark.className = 'block-mark';
      // テキストは設定せずCSSで画像を表示
      card.appendChild(blockMark);
    }
  });
}

// スキルボタン状態更新関数
function updateSkillButtons() {
  console.log('updateSkillButtons called');
  
  // プレイヤー1のボタン更新
  const player1Buttons = document.querySelectorAll('.player1-skills .skill-btn');
  console.log('Player1 buttons found:', player1Buttons.length);
  
  // 各ボタンのスキル番号を正しく設定
  const skillTypes = ['block', 'shuffle', 'extra'];
  
  player1Buttons.forEach((btn, index) => {
    const skillType = skillTypes[index];
    const skillNum = skillType === 'block' ? 1 : skillType === 'shuffle' ? 2 : skillType === 'extra' ? 3 : 0;
    const isUsed = activeSkills[1].includes(skillNum);
    const isPending = pendingSkills[1] !== null;
    
    console.log(`Player1 button ${index + 1} (${skillType}): used=${isUsed}, pending=${isPending}`);
    
    if (isUsed) {
      btn.disabled = true;
      btn.classList.add('skill-used');
    } else if (isPending) {
      btn.disabled = true;
      btn.classList.add('skill-pending');
    } else {
      btn.disabled = false;
      btn.classList.remove('skill-used', 'skill-pending');
    }
  });
  
  // プレイヤー2のボタン更新
  const player2Buttons = document.querySelectorAll('.player2-skills .skill-btn');
  console.log('Player2 buttons found:', player2Buttons.length);
  
  player2Buttons.forEach((btn, index) => {
    const skillType = skillTypes[index];
    const skillNum = skillType === 'block' ? 1 : skillType === 'shuffle' ? 2 : skillType === 'extra' ? 3 : 0;
    const isUsed = activeSkills[2].includes(skillNum);
    const isPending = pendingSkills[2] !== null;
    
    console.log(`Player2 button ${index + 1} (${skillType}): used=${isUsed}, pending=${isPending}`);
    
    if (isUsed) {
      btn.disabled = true;
      btn.classList.add('skill-used');
    } else if (isPending) {
      btn.disabled = true;
      btn.classList.add('skill-pending');
    } else {
      btn.disabled = false;
      btn.classList.remove('skill-used', 'skill-pending');
    }
  });
}

// 初期スコア表示
updateScores();

// プレイヤー1スコアメッセージ表示関数
function showPlayer1ScoreMessage() {
  const existingMessage = document.querySelector('.player1-score-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const message = document.createElement('div');
  message.className = 'player1-score-message';
  message.textContent = `${player1Score.toString().replace(/[0-9]/g, d => '０１２３４５６７８９'[parseInt(d)])}ペア！`;
  document.body.appendChild(message);
}

// プレイヤー2スコアメッセージ表示関数
function showPlayer2ScoreMessage() {
  const existingMessage = document.querySelector('.player2-score-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const message = document.createElement('div');
  message.className = 'player2-score-message';
  message.textContent = `${player2Score.toString().replace(/[0-9]/g, d => '０１２３４５６７８９'[parseInt(d)])}ペア！`;
  document.body.appendChild(message);
}

// ゲーム開始時に「0ペア！」を表示
function showInitialPairMessage() {
  showPlayer1ScoreMessage();
  showPlayer2ScoreMessage();
}

// キャラクターカードを初期化
initCharacterCard();

// デコレーションカードを初期化
initDecorationCard();

// 音量調整機能
function initVolumeControl() {
  // スタート画面の音量調整
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');
  
  if (volumeSlider && volumeValue) {
    // スライダーの値が変更されたときの処理
    volumeSlider.addEventListener('input', function() {
      const volume = this.value;
      bgmVolume = volume / 100; // 0-1の範囲に変換
      volumeValue.textContent = volume + '%';
      
      // ゲーム画面のBGMスライダーも同期
      const bgmSliderGame = document.getElementById('bgm-slider-game');
      const bgmValueGame = document.getElementById('bgm-value-game');
      if (bgmSliderGame && bgmValueGame) {
        bgmSliderGame.value = volume;
        bgmValueGame.textContent = volume + '%';
      }
      
      // BGMの音量を更新
      updateBGMVolume();
    });
    
    // スライダーをクリックしたときのイベント伝播を停止
    volumeSlider.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // ゲーム画面のBGM音量調整
  const bgmSliderGame = document.getElementById('bgm-slider-game');
  const bgmValueGame = document.getElementById('bgm-value-game');
  
  if (bgmSliderGame && bgmValueGame) {
    // スライダーの値が変更されたときの処理
    bgmSliderGame.addEventListener('input', function() {
      const volume = this.value;
      bgmVolume = volume / 100; // 0-1の範囲に変換
      bgmValueGame.textContent = volume + '%';
      
      // スタート画面のスライダーも同期
      const startSlider = document.getElementById('volume-slider');
      const startValue = document.getElementById('volume-value');
      if (startSlider && startValue) {
        startSlider.value = volume;
        startValue.textContent = volume + '%';
      }
      
      // BGMの音量を更新
      updateBGMVolume();
    });
    
    // スライダーをクリックしたときのイベント伝播を停止
    bgmSliderGame.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // ゲーム画面の効果音音量調整
  const sfxSliderGame = document.getElementById('sfx-slider-game');
  const sfxValueGame = document.getElementById('sfx-value-game');
  
  if (sfxSliderGame && sfxValueGame) {
    // スライダーの値が変更されたときの処理
    sfxSliderGame.addEventListener('input', function() {
      const volume = this.value;
      sfxVolume = volume / 100; // 0-1の範囲に変換
      sfxValueGame.textContent = volume + '%';
      
      // 効果音の音量を更新
      updateSFXVolume();
    });
    
    // スライダーをクリックしたときのイベント伝播を停止
    sfxSliderGame.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
}

// BGM音量を更新する関数
function updateBGMVolume() {
  if (bgmAudio) {
    bgmAudio.volume = bgmVolume;
  }
  if (gameBgmAudio) {
    gameBgmAudio.volume = bgmVolume;
  }
}

// 効果音音量を更新する関数
function updateSFXVolume() {
  // 効果音の音量を更新する処理
  // 効果音が再生されるときにsfxVolumeを使用する
}

// 音量バーの表示/非表示を切り替える関数
function toggleVolumeBar() {
  const volumeBarContainer = document.getElementById('volume-bar-container');
  const volumeIcon = document.getElementById('volume-icon');
  
  if (volumeBarContainer) {
    const isShowing = volumeBarContainer.classList.contains('show');
    
    if (isShowing) {
      volumeBarContainer.classList.remove('show');
      volumeIcon.classList.remove('active');
    } else {
      volumeBarContainer.classList.add('show');
      volumeIcon.classList.add('active');
    }
  }
}

// タブ切り替え関数
function switchTab(tabName) {
  // すべてのタブを非アクティブに
  const allTabs = document.querySelectorAll('.rule-tab');
  allTabs.forEach(tab => tab.classList.remove('active'));
  
  // すべてのタブコンテンツを非表示に
  const allContents = document.querySelectorAll('.tab-content');
  allContents.forEach(content => content.classList.remove('active'));
  
  // 選択されたタブをアクティブに
  if (tabName === 'howto') {
    document.querySelector('.rule-tab:first-child').classList.add('active');
    document.getElementById('howto-tab').classList.add('active');
  } else if (tabName === 'future') {
    document.querySelector('.rule-tab:last-child').classList.add('active');
    document.getElementById('future-tab').classList.add('active');
  }
}

// ホーム確認モーダルを表示する関数
function confirmGoHome() {
  const homeConfirmModal = document.getElementById('home-confirm-modal');
  if (homeConfirmModal) {
    homeConfirmModal.classList.add('show');
  }
}

// ホームに戻る関数
function goToHome() {
  // ホームページに遷移
  window.location.href = 'index.html';
}

// ホーム確認モーダルを閉じる関数
function closeHomeConfirm() {
  const homeConfirmModal = document.getElementById('home-confirm-modal');
  if (homeConfirmModal) {
    homeConfirmModal.classList.remove('show');
  }
}

// クレジットモーダルを表示する関数
function showCredits() {
  const creditModal = document.getElementById('credit-modal');
  if (creditModal) {
    creditModal.classList.add('show');
  }
}

// クレジットモーダルを非表示にする関数
function hideCredits() {
  const creditModal = document.getElementById('credit-modal');
  if (creditModal) {
    creditModal.classList.remove('show');
  }
}

// ルールモーダルの表示/非表示を切り替える関数
function toggleRules() {
  const ruleModal = document.getElementById('rule-modal');
  if (ruleModal) {
    ruleModal.classList.toggle('show');
  }
}

// ルールモーダルのページ切り替え関数
function switchRulePage(pageNumber) {
  // 全ページを非表示
  document.querySelectorAll('.rule-page').forEach(page => {
    page.classList.remove('active');
  });
  // 全ボタンを非アクティブ
  document.querySelectorAll('.rule-page-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  // 指定ページを表示
  document.getElementById('rule-page-' + pageNumber).classList.add('active');
  // 指定ボタンをアクティブ
  document.getElementById('page-btn-' + pageNumber).classList.add('active');
}

// 音量調整を初期化
initVolumeControl();

/* ============ オンライン対戦 ============ */
const NET_PREFIX = 'milmemo-';
let netMode = 'local';        // 'local' | 'host' | 'guest'
let peer = null;
let conn = null;
let netConnected = false;
let myPlayerNum = 0;          // ホスト=1 / ゲスト=2
let remoteChar = null;        // 相手が選択中のキャラクター
let remoteQueue = [];         // 受信した操作の待機キュー
let remotePumpTimer = null;
let rngState = 1;             // 対局状態に関わる乱数の種（ホストが決定）

const oppPlayerNum = () => (myPlayerNum === 1 ? 2 : 1);

// 対局状態に関わる乱数（オンライン時は両側で同じ結果になるようシードを共有）
function gameRandom() {
  if (netMode === 'local') return Math.random();
  rngState |= 0; rngState = (rngState + 0x6D2B79F5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function newCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[(Math.random() * chars.length) | 0];
  return s;
}

function closePeer() {
  try { if (conn) conn.close(); } catch (e) {}
  try { if (peer) peer.destroy(); } catch (e) {}
  conn = null; peer = null; netConnected = false;
}

function netSend(obj) {
  if (conn && conn.open) conn.send(obj);
}

function setNetMsg(t) {
  const el = document.getElementById('net-msg');
  if (el) el.textContent = t;
}

// 自分の選択キャラを相手へ送る
function sendMyChar(decided) {
  if (netMode === 'local' || !conn || !conn.open) return;
  const sel = myPlayerNum === 1 ? selectedPlayer1Character : selectedPlayer2Character;
  const cur = myPlayerNum === 1 ? currentSelectionPlayer1 : currentSelectionPlayer2;
  const d = decided !== undefined ? decided : !!sel;
  netSend({ t: 'char', c: sel || cur, decided: d });
}

// ゲームスタートボタンの有効/無効をモードに応じて更新
function refreshStartBtn() {
  const startBtn = document.getElementById('start-btn');
  if (!startBtn) return;
  if (netMode === 'guest') { startBtn.disabled = true; return; }
  if (netMode === 'host') { startBtn.disabled = !netConnected; return; }
  startBtn.disabled = !(selectedPlayer1Character && selectedPlayer2Character);
}

// オンライン用にキャラ選択パネルを設定（自分側のみ操作可・相手側は表示のみ）
function applyOnlinePanels() {
  const mySel = document.querySelector(myPlayerNum === 1 ? '.player1-selection' : '.player2-selection');
  const oppSel = document.querySelector(myPlayerNum === 1 ? '.player2-selection' : '.player1-selection');
  if (mySel) {
    const label = mySel.querySelector('.player-label');
    if (label) label.textContent = `PLAYER ${myPlayerNum}（あなた）`;
  }
  if (oppSel) {
    const label = oppSel.querySelector('.player-label');
    if (label) label.textContent = `PLAYER ${oppPlayerNum()}（相手）`;
    oppSel.querySelectorAll('.nav-btn, .decide-btn').forEach(b => b.disabled = true);
  }
}

// 「オンライン対戦」ボタン
function enterOnlineMode() {
  if (typeof Peer === 'undefined') {
    showGeneralMessage('通信ライブラリを読み込めませんでした<br>(インターネット接続が必要です)', 2500);
    return;
  }
  if (netMode !== 'local') return;
  if (!broadcastStarted) startBroadcast();
  document.getElementById('online-panel').classList.remove('hidden');
  document.getElementById('net-setup').classList.remove('hidden');
  document.getElementById('net-wait').classList.add('hidden');
  setNetMsg('部屋を作るか、コードで参加してください');
}

// 「戻る」ボタン（ローカルモードへ復帰）
function leaveOnlineMode() {
  closePeer();
  netMode = 'local';
  myPlayerNum = 0;
  remoteChar = null;
  remoteQueue = [];
  if (remotePumpTimer) { clearInterval(remotePumpTimer); remotePumpTimer = null; }
  document.getElementById('online-panel').classList.add('hidden');
  document.getElementById('net-setup').classList.remove('hidden');
  document.getElementById('net-wait').classList.add('hidden');
  setNetMsg('');
  document.querySelector('.player1-selection .player-label').textContent = 'PLAYER 1';
  document.querySelector('.player2-selection .player-label').textContent = 'PLAYER 2';
  // まだ決定していない側の操作を再有効化
  if (!selectedPlayer1Character) {
    document.querySelectorAll('.player1-selection .nav-btn, .player1-selection .decide-btn').forEach(b => b.disabled = false);
  }
  if (!selectedPlayer2Character) {
    document.querySelectorAll('.player2-selection .nav-btn, .player2-selection .decide-btn').forEach(b => b.disabled = false);
  }
  refreshStartBtn();
}

// 部屋を作る（ホスト=Player1）
function startHost() {
  netMode = 'host';
  myPlayerNum = 1;
  applyOnlinePanels();
  refreshStartBtn();
  closePeer();
  peer = new Peer(NET_PREFIX + newCode());
  peer.on('open', id => {
    document.getElementById('room-code').textContent = id.slice(NET_PREFIX.length);
    document.getElementById('net-setup').classList.add('hidden');
    document.getElementById('net-wait').classList.remove('hidden');
    setNetMsg('相手の接続を待っています…');
  });
  peer.on('connection', c => {
    if (conn) { try { c.close(); } catch (e) {} return; } // 接続済みなら拒否
    conn = c;
    setupConn();
    c.on('open', () => {
      if (gameStarted) { netSend({ t: 'busy' }); try { c.close(); } catch (e) {} conn = null; return; }
      netConnected = true;
      document.getElementById('net-wait').classList.add('hidden');
      setNetMsg('接続しました！キャラをえらんで「ゲームスタート」');
      sendMyChar();
      refreshStartBtn();
    });
  });
  peer.on('error', e => {
    if (e.type === 'unavailable-id') { closePeer(); startHost(); } // コード衝突→引き直し
    else setNetMsg('エラー: ' + e.type);
  });
}

// 部屋に入る（ゲスト=Player2）
function joinRoom() {
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  if (!code) { setNetMsg('コードを入力してください'); return; }
  netMode = 'guest';
  myPlayerNum = 2;
  applyOnlinePanels();
  refreshStartBtn();
  closePeer();
  peer = new Peer();
  peer.on('open', () => {
    conn = peer.connect(NET_PREFIX + code);
    setupConn();
    conn.on('open', () => {
      netConnected = true;
      document.getElementById('net-setup').classList.add('hidden');
      setNetMsg('接続しました！キャラをえらんで待ってください');
      sendMyChar();
    });
    conn.on('error', () => setNetMsg('接続に失敗しました'));
  });
  peer.on('error', e => {
    if (e.type === 'peer-unavailable') setNetMsg('部屋が見つかりません（コードを確認してください）');
    else setNetMsg('接続できませんでした: ' + e.type);
  });
}

function setupConn() {
  conn.on('data', onNetData);
  conn.on('close', () => {
    conn = null;
    netConnected = false;
    remoteQueue = [];
    if (gameStarted) {
      showGeneralMessage('相手との接続が切れました', 0);
      lock = true;
    } else if (netMode === 'host') {
      // ゲーム前なら再び接続待ちに戻る
      document.getElementById('net-wait').classList.remove('hidden');
      setNetMsg('相手が切断しました。再接続を待っています…');
    } else {
      document.getElementById('net-setup').classList.remove('hidden');
      setNetMsg('切断されました');
    }
    refreshStartBtn();
  });
}

// 相手からのメッセージ処理
function onNetData(d) {
  if (!d || typeof d !== 'object') return;
  if (d.t === 'char') {
    // 相手の選択キャラをパネルに反映
    remoteChar = d.c;
    const opp = oppPlayerNum();
    updateSelectionCard(opp, d.c);
    if (d.decided) {
      if (opp === 1) selectedPlayer1Character = d.c; else selectedPlayer2Character = d.c;
      const sel = document.querySelector(opp === 1 ? '.selection-left' : '.selection-right');
      if (sel) {
        sel.classList.add('flipped');
        setTimeout(() => sel.classList.remove('flipped'), 2000);
      }
    }
  } else if (d.t === 'start' && netMode === 'guest') {
    // ホストからの対局開始（カードの並び・乱数シード・両キャラを受け取る）
    if (!Array.isArray(d.deck) || !Array.isArray(d.chars)) return;
    rngState = d.seed >>> 0;
    selectedPlayer1Character = d.chars[0];
    selectedPlayer2Character = d.chars[1];
    buildBoard(d.deck);
    beginMatch();
  } else if (d.t === 'busy') {
    setNetMsg('この部屋は対戦中です');
  } else if (d.t === 'click' || d.t === 'skill') {
    queueRemote(d);
  }
}

// 受信した操作をキューに入れる（アニメーション中でも取りこぼさないよう再試行する）
function queueRemote(a) {
  a.qAt = Date.now();
  remoteQueue.push(a);
  if (!remotePumpTimer) remotePumpTimer = setInterval(pumpRemote, 120);
  pumpRemote();
}

function pumpRemote() {
  let guard = 0;
  while (remoteQueue.length && guard++ < 20) {
    const a = remoteQueue[0];
    if (Date.now() - a.qAt > 30000) { remoteQueue.shift(); continue; } // 30秒以上処理できない操作は破棄
    if (a.t === 'click') {
      const card = board.children[a.i];
      if (!card || currentPlayer !== oppPlayerNum() || !canClickCard(card, true)) break;
      remoteQueue.shift();
      doCardClick(card);
    } else if (a.t === 'skill') {
      if (a.s !== 'block' && a.s !== 'shuffle' && a.s !== 'extra') { remoteQueue.shift(); continue; }
      if (!canApplyRemoteSkill(oppPlayerNum(), a.s)) break;
      remoteQueue.shift();
      activateSkill(oppPlayerNum(), a.s);
    } else {
      remoteQueue.shift();
    }
  }
  if (!remoteQueue.length && remotePumpTimer) {
    clearInterval(remotePumpTimer);
    remotePumpTimer = null;
  }
}

// オンラインUIのイベント配線
document.getElementById('btn-host').onclick = startHost;
document.getElementById('btn-join').onclick = joinRoom;
document.getElementById('btn-net-back').onclick = leaveOnlineMode;
document.getElementById('join-code').addEventListener('keydown', e => { if (e.key === 'Enter') joinRoom(); });
