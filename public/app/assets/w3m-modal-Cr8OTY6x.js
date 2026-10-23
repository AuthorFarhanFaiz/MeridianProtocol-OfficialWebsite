import{N as v,v as _t,R as m,S,b as W,c as I,E as D,x as Ue,y as We,j as f,B as be,a as z,z as ve,D as xe,F as Rt,o as Xe,G as Vt,C as U,I as rt,J as st,K as at,M as O,L as Ot,e as A,r as X,i as T,d as c,k as qe,w as Ut,P as Ht,Q as Gt,U as P,V as Yt,H as V,O as E,X as yt,h as L,Y as Te,u as Ve,f as Qt,A as Re,T as Kt,Z as Xt,_ as Zt}from"./core-CSH1uYEM.js";import{c as x,n as d,o as k,r as h,a as Jt,U as He,b as Wt}from"./index-BH2bE4T0.js";import"./index-D8NixbLH.js";import"./index-Cu1-ClI8.js";const ne={getGasPriceInEther(e,t){const n=t*e;return Number(n)/1e18},getGasPriceInUSD(e,t,n){const o=ne.getGasPriceInEther(t,n);return v.bigNumber(e).times(o).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:n,toTokenAmount:o}){const r=v.bigNumber(e).times(t),i=v.bigNumber(o).times(n);return r.minus(i).div(r).times(100).toNumber()},getMaxSlippage(e,t){const n=v.bigNumber(e).div(100);return v.multiply(t,n).toNumber()},getProviderFee(e,t=.0085){return v.bigNumber(e).times(t).toString()},isInsufficientNetworkTokenForGas(e,t){const n=t||"0";return v.bigNumber(e).eq(0)?!0:v.bigNumber(v.bigNumber(n)).gt(e)},isInsufficientSourceTokenForSwap(e,t,n){const o=n?.find(i=>i.address===t)?.quantity?.numeric;return v.bigNumber(o||"0").lt(e)}},bt=15e4,en=6,R={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,switchingTokens:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:Xe.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},l=at({...R}),De={state:l,subscribe(e){return st(l,()=>e(l))},subscribeKey(e,t){return rt(l,e,t)},getParams(){const e=f.state.activeChain,t=f.getAccountData(e)?.caipAddress??f.state.activeCaipAddress,n=z.getPlainAddress(t),o=Vt(),r=U.getConnectorId(f.state.activeChain);if(!n)throw new Error("No address found to swap the tokens from.");const i=!l.toToken?.address||!l.toToken?.decimals,s=!l.sourceToken?.address||!l.sourceToken?.decimals||!v.bigNumber(l.sourceTokenAmount).gt(0),a=!l.sourceTokenAmount;return{networkAddress:o,fromAddress:n,fromCaipAddress:t,sourceTokenAddress:l.sourceToken?.address,toTokenAddress:l.toToken?.address,toTokenAmount:l.toTokenAmount,toTokenDecimals:l.toToken?.decimals,sourceTokenAmount:l.sourceTokenAmount,sourceTokenDecimals:l.sourceToken?.decimals,invalidToToken:i,invalidSourceToken:s,invalidSourceTokenAmount:a,availableToSwap:t&&!i&&!s&&!a,isAuthConnector:r===I.CONNECTOR_ID.AUTH}},async setSourceToken(e){if(!e){l.sourceToken=e,l.sourceTokenAmount="",l.sourceTokenPriceInUSD=0;return}l.sourceToken=e,await w.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){l.sourceTokenAmount=e},async setToToken(e){if(!e){l.toToken=e,l.toTokenAmount="",l.toTokenPriceInUSD=0;return}l.toToken=e,await w.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){l.toTokenAmount=e?v.toFixed(e,en):""},async setTokenPrice(e,t){let n=l.tokensPriceMap[e]||0;n||(l.loadingPrices=!0,n=await w.getAddressPrice(e)),t==="sourceToken"?l.sourceTokenPriceInUSD=n:t==="toToken"&&(l.toTokenPriceInUSD=n),l.loadingPrices&&(l.loadingPrices=!1),w.getParams().availableToSwap&&!l.switchingTokens&&w.swapTokens()},async switchTokens(){if(!(l.initializing||!l.initialized||l.switchingTokens)){l.switchingTokens=!0;try{const e=l.toToken?{...l.toToken}:void 0,t=l.sourceToken?{...l.sourceToken}:void 0,n=e&&l.toTokenAmount===""?"1":l.toTokenAmount;w.setSourceTokenAmount(n),w.setToTokenAmount(""),await w.setSourceToken(e),await w.setToToken(t),l.switchingTokens=!1,w.swapTokens()}catch(e){throw l.switchingTokens=!1,e}}},resetState(){l.myTokensWithBalance=R.myTokensWithBalance,l.tokensPriceMap=R.tokensPriceMap,l.initialized=R.initialized,l.initializing=R.initializing,l.switchingTokens=R.switchingTokens,l.sourceToken=R.sourceToken,l.sourceTokenAmount=R.sourceTokenAmount,l.sourceTokenPriceInUSD=R.sourceTokenPriceInUSD,l.toToken=R.toToken,l.toTokenAmount=R.toTokenAmount,l.toTokenPriceInUSD=R.toTokenPriceInUSD,l.networkPrice=R.networkPrice,l.networkTokenSymbol=R.networkTokenSymbol,l.networkBalanceInUSD=R.networkBalanceInUSD,l.inputError=R.inputError},resetValues(){const{networkAddress:e}=w.getParams(),t=l.tokens?.find(n=>n.address===e);w.setSourceToken(t),w.setToToken(void 0)},getApprovalLoadingState(){return l.loadingApprovalTransaction},clearError(){l.transactionError=void 0},async initializeState(){if(!l.initializing){if(l.initializing=!0,!l.initialized)try{await w.fetchTokens(),l.initialized=!0}catch{l.initialized=!1,S.showError("Failed to initialize swap"),m.goBack()}l.initializing=!1}},async fetchTokens(){const{networkAddress:e}=w.getParams();await w.getNetworkTokenPrice(),await w.getMyTokensWithBalance();const t=l.myTokensWithBalance?.find(n=>n.address===e);t&&(l.networkTokenSymbol=t.symbol,w.setSourceToken(t),w.setSourceTokenAmount("0"))},async getTokenList(){const e=f.state.activeCaipNetwork?.caipNetworkId;if(!(l.caipNetworkId===e&&l.tokens))try{l.tokensLoading=!0;const t=await ve.getTokenList(e);l.tokens=t,l.caipNetworkId=e,l.popularTokens=t.sort((s,a)=>s.symbol<a.symbol?-1:s.symbol>a.symbol?1:0);const o=(e&&Xe.SUGGESTED_TOKENS_BY_CHAIN?.[e]||[]).map(s=>t.find(a=>a.symbol===s)).filter(s=>!!s),i=(Xe.SWAP_SUGGESTED_TOKENS||[]).map(s=>t.find(a=>a.symbol===s)).filter(s=>!!s).filter(s=>!o.some(a=>a.address===s.address));l.suggestedTokens=[...o,...i]}catch{l.tokens=[],l.popularTokens=[],l.suggestedTokens=[]}finally{l.tokensLoading=!1}},async getAddressPrice(e){const t=l.tokensPriceMap[e];if(t)return t;const o=(await be.fetchTokenPrice({addresses:[e]}))?.fungibles||[],i=[...l.tokens||[],...l.myTokensWithBalance||[]]?.find(b=>b.address===e)?.symbol,s=o.find(b=>b.symbol.toLowerCase()===i?.toLowerCase())?.price||0,a=parseFloat(s.toString());return l.tokensPriceMap[e]=a,a},async getNetworkTokenPrice(){const{networkAddress:e}=w.getParams(),n=(await be.fetchTokenPrice({addresses:[e]}).catch(()=>(S.showError("Failed to fetch network token price"),{fungibles:[]}))).fungibles?.[0],o=n?.price.toString()||"0";l.tokensPriceMap[e]=parseFloat(o),l.networkTokenSymbol=n?.symbol||"",l.networkPrice=o},async getMyTokensWithBalance(e){const t=await Rt.getMyTokensWithBalance({forceUpdate:e,caipNetwork:f.state.activeCaipNetwork,address:f.getAccountData()?.address}),n=ve.mapBalancesToSwapTokens(t);n&&(await w.getInitialGasPrice(),w.setBalances(n))},setBalances(e){const{networkAddress:t}=w.getParams(),n=f.state.activeCaipNetwork;if(!n)return;const o=e.find(r=>r.address===t);e.forEach(r=>{l.tokensPriceMap[r.address]=r.price||0}),l.myTokensWithBalance=e.filter(r=>r.address.startsWith(n.caipNetworkId)),l.networkBalanceInUSD=o?v.multiply(o.quantity.numeric,o.price).toString():"0"},async getInitialGasPrice(){const e=await ve.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(f.state?.activeCaipNetwork?.chainNamespace){case I.CHAIN.SOLANA:return l.gasFee=e.standard??"0",l.gasPriceInUSD=v.multiply(e.standard,l.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(l.gasFee),gasPriceInUSD:Number(l.gasPriceInUSD)};case I.CHAIN.EVM:default:const t=e.standard??"0",n=BigInt(t),o=BigInt(bt),r=ne.getGasPriceInUSD(l.networkPrice,o,n);return l.gasFee=t,l.gasPriceInUSD=r,{gasPrice:n,gasPriceInUSD:r}}},async swapTokens(){const e=f.getAccountData()?.address,t=l.sourceToken,n=l.toToken,o=v.bigNumber(l.sourceTokenAmount).gt(0);if(o||w.setToTokenAmount(""),!n||!t||l.loadingPrices||!o||!e)return;l.loadingQuote=!0;const r=v.bigNumber(l.sourceTokenAmount).times(10**t.decimals).round(0).toFixed(0);try{const i=await be.fetchSwapQuote({userAddress:e,from:t.address,to:n.address,gasPrice:l.gasFee,amount:r.toString()});l.loadingQuote=!1;const s=i?.quotes?.[0]?.toAmount;if(!s){xe.open({displayMessage:"Incorrect amount",debugMessage:"Please enter a valid amount"},"error");return}const a=v.bigNumber(s).div(10**n.decimals).toString();w.setToTokenAmount(a),w.hasInsufficientToken(l.sourceTokenAmount,t.address)?l.inputError="Insufficient balance":(l.inputError=void 0,w.setTransactionDetails())}catch(i){const s=await ve.handleSwapError(i);l.loadingQuote=!1,l.inputError=s||"Insufficient balance"}},async getTransaction(){const{fromCaipAddress:e,availableToSwap:t}=w.getParams(),n=l.sourceToken,o=l.toToken;if(!(!e||!t||!n||!o||l.loadingQuote))try{l.loadingBuildTransaction=!0;const r=await ve.fetchSwapAllowance({userAddress:e,tokenAddress:n.address,sourceTokenAmount:l.sourceTokenAmount,sourceTokenDecimals:n.decimals});let i;return r?i=await w.createSwapTransaction():i=await w.createAllowanceTransaction(),l.loadingBuildTransaction=!1,l.fetchError=!1,i}catch{m.goBack(),S.showError("Failed to check allowance"),l.loadingBuildTransaction=!1,l.approvalTransaction=void 0,l.swapTransaction=void 0,l.fetchError=!0;return}},async createAllowanceTransaction(){const{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:n}=w.getParams();if(!(!e||!n)){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{const o=await be.generateApproveCalldata({from:t,to:n,userAddress:e}),r=z.getPlainAddress(o.tx.from);if(!r)throw new Error("SwapController:createAllowanceTransaction - address is required");const i={data:o.tx.data,to:r,gasPrice:BigInt(o.tx.eip155.gasPrice),value:BigInt(o.tx.value),toAmount:l.toTokenAmount};return l.swapTransaction=void 0,l.approvalTransaction={data:i.data,to:i.to,gasPrice:i.gasPrice,value:i.value,toAmount:i.toAmount},{data:i.data,to:i.to,gasPrice:i.gasPrice,value:i.value,toAmount:i.toAmount}}catch{m.goBack(),S.showError("Failed to create approval transaction"),l.approvalTransaction=void 0,l.swapTransaction=void 0,l.fetchError=!0;return}}},async createSwapTransaction(){const{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:n}=w.getParams(),o=l.sourceToken,r=l.toToken;if(!t||!n||!o||!r)return;const i=W.parseUnits(n,o.decimals)?.toString();try{const s=await be.generateSwapCalldata({userAddress:t,from:o.address,to:r.address,amount:i,disableEstimate:!0}),a=o.address===e,b=BigInt(s.tx.eip155.gas),he=BigInt(s.tx.eip155.gasPrice),_e=z.getPlainAddress(s.tx.to);if(!_e)throw new Error("SwapController:createSwapTransaction - address is required");const ye={data:s.tx.data,to:_e,gas:b,gasPrice:he,value:BigInt(a?i??"0":"0"),toAmount:l.toTokenAmount};return l.gasPriceInUSD=ne.getGasPriceInUSD(l.networkPrice,b,he),l.approvalTransaction=void 0,l.swapTransaction=ye,ye}catch{m.goBack(),S.showError("Failed to create transaction"),l.approvalTransaction=void 0,l.swapTransaction=void 0,l.fetchError=!0;return}},onEmbeddedWalletApprovalSuccess(){S.showLoading("Approve limit increase in your wallet"),m.replace("SwapPreview")},async sendTransactionForApproval(e){const{fromAddress:t,isAuthConnector:n}=w.getParams();l.loadingApprovalTransaction=!0,n?m.pushTransactionStack({onSuccess:w.onEmbeddedWalletApprovalSuccess}):S.showLoading("Approve limit increase in your wallet");try{await W.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:I.CHAIN.EVM}),await w.swapTokens(),await w.getTransaction(),l.approvalTransaction=void 0,l.loadingApprovalTransaction=!1}catch(r){const i=r;l.transactionError=i?.displayMessage,l.loadingApprovalTransaction=!1,S.showError(i?.displayMessage||"Transaction error"),D.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:i?.displayMessage||i?.message||"Unknown",network:f.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:w.state.sourceToken?.symbol||"",swapToToken:w.state.toToken?.symbol||"",swapFromAmount:w.state.sourceTokenAmount||"",swapToAmount:w.state.toTokenAmount||"",isSmartAccount:Ue(I.CHAIN.EVM)===We.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;const{fromAddress:t,toTokenAmount:n,isAuthConnector:o}=w.getParams();l.loadingTransaction=!0;const r=`Swapping ${l.sourceToken?.symbol} to ${v.formatNumberToLocalString(n,3)} ${l.toToken?.symbol}`,i=`Swapped ${l.sourceToken?.symbol} to ${v.formatNumberToLocalString(n,3)} ${l.toToken?.symbol}`;o?m.pushTransactionStack({onSuccess(){m.replace("Account"),S.showLoading(r),De.resetState()}}):S.showLoading("Confirm transaction in your wallet");try{const s=[l.sourceToken?.address,l.toToken?.address].join(","),a=await W.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:I.CHAIN.EVM});return l.loadingTransaction=!1,S.showSuccess(i),D.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:f.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:w.state.sourceToken?.symbol||"",swapToToken:w.state.toToken?.symbol||"",swapFromAmount:w.state.sourceTokenAmount||"",swapToAmount:w.state.toTokenAmount||"",isSmartAccount:Ue(I.CHAIN.EVM)===We.ACCOUNT_TYPES.SMART_ACCOUNT}}),De.resetState(),o||m.replace("Account"),De.getMyTokensWithBalance(s),a}catch(s){const a=s;l.transactionError=a?.displayMessage,l.loadingTransaction=!1,S.showError(a?.displayMessage||"Transaction error"),D.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:a?.displayMessage||a?.message||"Unknown",network:f.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:w.state.sourceToken?.symbol||"",swapToToken:w.state.toToken?.symbol||"",swapFromAmount:w.state.sourceTokenAmount||"",swapToAmount:w.state.toTokenAmount||"",isSmartAccount:Ue(I.CHAIN.EVM)===We.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken(e,t){return ne.isInsufficientSourceTokenForSwap(e,t,l.myTokensWithBalance)},setTransactionDetails(){const{toTokenAddn):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const sn={info:"info",success:"checkmark",warning:"warningCircle",error:"warning"};let Ae=class extends T{constructor(){super(...arguments),this.message="",this.type="info"}render(){return c`
      <wui-flex
        data-type=${k(this.type)}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap="2"
      >
        <wui-flex columnGap="2" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color="inherit" size="md" name=${sn[this.type]}></wui-icon>
          </wui-flex>
          <wui-text variant="md-medium" color="inherit" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="inherit"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){xe.close()}};Ae.styles=[X,rn];ct([d()],Ae.prototype,"message",void 0);ct([d()],Ae.prototype,"type",void 0);Ae=ct([x("wui-alertbar")],Ae);const an=A`
  :host {
    display: block;
    position: absolute;
    top: ${({spacing:e})=>e[3]};
    left: ${({spacing:e})=>e[4]};
    right: ${({spacing:e})=>e[4]};
    opacity: 0;
    pointer-events: none;
  }
`;var Lt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const cn={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"warning"}};let Le=class extends T{constructor(){super(),this.unsubscribe=[],this.open=xe.state.open,this.onOpen(!0),this.unsubscribe.push(xe.subscribeKey("open",t=>{this.open=t,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const{message:t,variant:n}=xe.state,o=cn[n];return c`
      <wui-alertbar
        message=${t}
        backgroundColor=${o?.backgroundColor}
        iconColor=${o?.iconColor}
        icon=${o?.icon}
        type=${n}
      ></wui-alertbar>
    `}onOpen(t){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):t||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};Le.styles=an;Lt([h()],Le.prototype,"open",void 0);Le=Lt([x("w3m-alertbar")],Le);const ln=A`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var ae=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Y=class extends T{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return c`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${k(this.iconSize)}></wui-icon>
    </button>`}};Y.styles=[X,qe,ln];ae([d()],Y.prototype,"icon",void 0);ae([d()],Y.prototype,"variant",void 0);ae([d()],Y.prototype,"type",void 0);ae([d()],Y.prototype,"size",void 0);ae([d()],Y.prototype,"iconSize",void 0);ae([d({type:Boolean})],Y.prototype,"fullWidth",void 0);ae([d({type:Boolean})],Y.prototype,"disabled",void 0);Y=ae([x("wui-icon-button")],Y);const un=A`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    border-radius: ${({borderRadius:e})=>e[32]};
  }

  wui-image {
    border-radius: 100%;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
  }

  .left-icon-container,
  .right-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-type='filled-dropdown'] {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  button[data-type='text-dropdown'] {
    background-color: transparent;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var we=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const dn={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},pn={lg:"lg",md:"md",sm:"sm"};let oe=class extends T{constructor(){super(...arguments),this.imageSrc="",this.text="",this.size="lg",this.type="text-dropdown",this.disabled=!1}render(){return c`<button ?disabled=${this.disabled} data-size=${this.size} data-type=${this.type}>
      ${this.imageTemplate()} ${this.textTemplate()}
      <wui-flex class="right-icon-container">
        <wui-icon name="chevronBottom"></wui-icon>
      </wui-flex>
    </button>`}textTemplate(){const t=dn[this.size];return this.text?c`<wui-text color="primary" variant=${t}>${this.text}</wui-text>`:null}imageTemplate(){if(this.imageSrc)return c`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`;const t=pn[this.size];return c` <wui-flex class="left-icon-container">
      <wui-icon size=${t} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}};oe.styles=[X,qe,un];we([d()],oe.prototype,"imageSrc",void 0);we([d()],oe.prototype,"text",void 0);we([d()],oe.prototype,"size",void 0);we([d()],oe.prototype,"type",void 0);we([d({type:Boolean})],oe.prototype,"disabled",void 0);oe=we([x("wui-select")],oe);const ue={ACCOUNT_TABS:[{label:"Tokens"},{label:"Activity"}],VIEW_DIRECTION:{Next:"next",Prev:"prev"},ANIMATION_DURATIONS:{HeaderText:120},VIEWS_WITH_LEGAL_FOOTER:["Connect","ConnectWallets","OnRampTokenSelect","OnRampFiatSelect","OnRampProviders"],VIEWS_WITH_DEFAULT_FOOTER:["Networks"]},hn=A`
  button {
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var fe=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let re=class extends T{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){const t={accent:"accent-primary",primary:"inverse",secondary:"default"};return c`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${t[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};re.styles=[X,qe,hn];fe([d()],re.prototype,"size",void 0);fe([d({type:Boolean})],re.prototype,"disabled",void 0);fe([d()],re.prototype,"icon",void 0);fe([d()],re.prototype,"iconColor",void 0);fe([d()],re.prototype,"variant",void 0);re=fe([x("wui-icon-link")],re);const mn=Ut`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`,wn=Ut`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`,fn=A`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 100%;
    outline: 1px solid ${({tokens:e})=>e.core.glass010};
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`;var pe=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let te=class extends T{constructor(){super(...arguments),this.size="md",this.name="uknown",this.networkImagesBySize={sm:wn,md:Jt,lg:mn},this.selected=!1,this.round=!1}render(){const t={sm:"4",md:"6",lg:"10"};return this.round?(this.dataset.round="true",this.style.cssText=`
      --local-width: var(--apkt-spacing-10);
      --local-height: var(--apkt-spacing-10);
      --local-icon-size: var(--apkt-spacing-4);
    `):th        </wui-flex>

        <wui-text variant="md-regular" color="primary">${t}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(t){return t==="completed"?c`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:t==="failed"?c`<wui-icon size="sm" color="error" name="close"></wui-icon>`:t==="pending"?c`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},Yn))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){const t=p.state.requestId;if(!t||It.includes(this.quoteStatus))this.stopPolling();else try{await p.fetchQuoteStatus({requestId:t}),It.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){const t=f.state.activeChain;this.namespace=t,this.caipAddress=f.getAccountData(t)?.caipAddress,this.profileName=f.getAccountData(t)?.profileName??null,this.unsubscribe.push(f.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress,this.profileName=n?.profileName??null},t))}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};const n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};const o=U.getConnector({id:n,namespace:t});if(!o)return{name:void 0,image:void 0};const r=L.getConnectorImage(o);return{name:o.name,image:r}}};j.styles=Hn;Z([h()],j.prototype,"paymentAsset",void 0);Z([h()],j.prototype,"quoteStatus",void 0);Z([h()],j.prototype,"quote",void 0);Z([h()],j.prototype,"amount",void 0);Z([h()],j.prototype,"namespace",void 0);Z([h()],j.prototype,"caipAddress",void 0);Z([h()],j.prototype,"profileName",void 0);Z([h()],j.prototype,"activeConnectorIds",void 0);Z([h()],j.prototype,"selectedExchange",void 0);j=Z([x("w3m-pay-loading-view")],j);const Qn=A`
  button {
    display: flex;
    align-items: center;
    height: 40px;
    padding: ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[4]};
    column-gap: ${({spacing:e})=>e[1]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  wui-image,
  .icon-box {
    width: ${({spacing:e})=>e[6]};
    height: ${({spacing:e})=>e[6]};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: 8px;
    height: 8px;
    background-color: ${({tokens:e})=>e.core.textSuccess};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: 50%;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var H=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let B=class extends T{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.enableGreenCircle=!0,this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return c`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){const t=this.icon?c`<wui-icon
          size=${k(this.iconSize)}
          color="default"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:c`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return c`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${!!this.icon}
      >
        ${t}
        ${this.enableGreenCircle?c`<wui-flex class="circle"></wui-flex>`:null}
      </wui-flex>
    `}textTemplate(){return c`
      <wui-text variant="lg-regular" color="primary">
        ${He.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
      </wui-text>
    `}rightImageTemplate(){return c`<wui-icon name="chevronBottom" size="sm" color="default"></wui-icon>`}};B.styles=[X,qe,Qn];H([d()],B.prototype,"address",void 0);H([d()],B.prototype,"profileName",void 0);H([d()],B.prototype,"alt",void 0);H([d()],B.prototype,"imageSrc",void 0);H([d()],B.prototype,"icon",void 0);H([d()],B.prototype,"iconSize",void 0);H([d({type:Boolean})],B.prototype,"enableGreenCircle",void 0);H([d({type:Boolean})],B.prototype,"loading",void 0);H([d({type:Number})],B.prototype,"charsStart",void 0);H([d({type:Number})],B.prototype,"charsEnd",void 0);B=H([x("wui-wallet-switch")],B);const Kn=Ve`
  :host {
    display: block;
  }
`;var Xn=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let tt=class extends T{render(){return c`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};tt.styles=[Kn];tt=Xn([x("w3m-pay-fees-skeleton")],tt);const Zn=A`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var Bt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Fe=class extends T{constructor(){super(),this.unsubscribe=[],this.quote=p.state.quote,this.unsubscribe.push(p.subscribeKey("quote",t=>this.quote=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=v.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return c`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${t} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(n=>this.renderFee(n)):null}
      </wui-flex>
    `}renderFee(t){const n=t.id==="network",o=v.formatNumber(t.amount||"0",{decimals:t.currency.metadata.decimals??0,round:6}).toString();if(n){const i=f.getAllRequestedCaipNetworks().find(s=>V.isLowerCaseMatch(s.caipNetworkId,t.currency.network));return c`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${o} ${t.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${k(L.getNetworkImage(i))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${i?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return c`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${o} ${t.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};Fe.styles=[Zn];Bt([h()],Fe.prototype,"quote",void 0);Fe=Bt([x("w3m-pay-fees")],Fe);const Jn=A`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var Ft=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let ze=class extends T{constructor(){super(),this.unsubscribe=[],this.selectedExchange=p.state.selectedExchange,this.unsubscribe.push(p.subscribeKey("selectedExchange",t=>this.selectedExchange=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=!!this.selectedExchange;return c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${t?null:c`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};ze.styles=[Jn];Ft([d({type:Array})],ze.prototype,"selectedExchange",void 0);ze=Ft([x("w3m-pay-options-empty")],ze);const ei=A`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`;var ti=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let nt=class extends T{render(){return c`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return c`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};nt.styles=[ei];nt=ti([x("w3m-pay-options-skeleton")],nt);const ni=A`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var Ge=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const ii=300;let me=class extends T{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(n=>n()),this.resizeObserver?.disconnect(),this.shadowRoot?.querySelector(".pay-options-container")?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){const t=this.shadowRoot?.querySelector(".pay-options-container");t&&(requestAnimationFrame(this   flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){const s=v.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return c`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?c`<wui-text variant="lg-regular" color="primary">
                ${v.bigNumber(s,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:c`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}const t=z.getPlainAddress(this.caipAddress)??"",{name:n,image:o}=this.getWalletProperties({namespace:this.namespace}),{icon:r,label:i}=ri[this.namespace]??{};return c`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${k(this.profileName)}
          address=${k(t)}
          imageSrc=${k(o)}
          alt=${k(n)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${k(i)}
          address=${k(t)}
          icon=${k(r)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${k(i)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){const t=f.state.activeChain;this.namespace=t,this.caipAddress=f.getAccountData(t)?.caipAddress,this.profileName=f.getAccountData(t)?.profileName??null,this.unsubscribe.push(f.subscribeChainProp("accountState",n=>this.onAccountStateChanged(n),t))}async fetchTokens(){if(this.namespace){let t;if(this.caipAddress){const{chainId:n,chainNamespace:o}=P.parseCaipAddress(this.caipAddress),r=`${o}:${n}`;t=f.getAllRequestedCaipNetworks().find(s=>s.caipNetworkId===r)}await p.fetchTokens({caipAddress:this.caipAddress,caipNetwork:t,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){const{address:t}=this.caipAddress?P.parseCaipAddress(this.caipAddress):{};p.fetchQuote({amount:this.amount.toString(),address:t,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};const n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};const o=U.getConnector({id:n,namespace:t});if(!o)return{name:void 0,image:void 0};const r=L.getConnectorImage(o);return{name:o.name,image:r}}paymentOptionsViewTemplate(){return c`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){const t=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return c`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(t.length===0)return c`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;const n={disabled:this.isFetchingQuote};return c`<w3m-pay-options
      class=${Wt(n)}
      .options=${t}
      .selectedPaymentAsset=${k(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?c`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:c`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){const t=this.isFetchingQuote||this.isFetchingTokenBalances,n=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,o=v.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?t||n?c`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:c`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:c`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${t||n?c`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:c`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${Be(o)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:t,isDisabled:n})}
      </wui-flex>
    `}actionButtonTemplate(t){const n=Ye(this.quote),{isLoading:o,isDisabled:r}=t;let i="Pay";return n.length>1&&this.completedTransactionsCount===0&&(i="Approve"),c`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${o||this.isPaymentInProgress}
        ?disabled=${r||this.isPaymentInProgress}
        @click=${()=>{n.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${i}
        ${o?null:c`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(r=>{try{return On(r)}catch{return null}}).filter(r=>!!r).filter(r=>{const{chainId:i}=P.parseCaipNetworkId(r.network),{chainId:s}=P.parseCaipNetworkId(this.paymentAsset.network);return V.isLowerCaseMatch(r.asset,this.paymentAsset.asset)?!0:this.selectedExchange?!V.isLowerCaseMatch(i.toString(),s.toString()):!0}):[]}onTokenBalancesChanged(t){this.tokenBalances=t;const[n]=this.getPaymentAssetFromTokenBalances();n&&p.setSelectedPaymentAsset(n)}async onConnectOtherWallet(){await U.connect(),await O.open({view:"PayQuote"})}onAccountStateChanged(t){const{address:n}=this.caipAddress?P.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=t?.caipAddress,this.profileName=t?.profileName??null,n){const{address:o}=this.caipAddress?P.parseCaipAddress(this.caipAddress):{};o?V.isLowerCaseMatch(o,n)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):O.close()}}onSelectedPaymentAssetChanged(t){this.isFetchingQuote||p.setSelectedPaymentAsset(t)}async onTransfer(){const t=Je(this.quote);if(t){if(!V.isLowerCaseMatch(this.selectedPaymentAsset?.asset,t.deposit.currency))throw new Error("Quote asset is not the same as the selected payment asset");const o=this.selectedPaymentAsset?.amount??"0",r=v.formatNumber(t.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!v.bigNumber(o).gte(r)){S.showError("Insufficient funds");return}if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){const{address:s}=P.parseCaipAddress(this.caipAddress);await p.onTransfer({chainNamespace:this.namespace,fromAddress:s,toAddress:t.deposit.receiver,amount:r,paymentAsset:this.selectedPaymentAsset}),p.setRequestId(t.requestId),m.push("PayLoading")}}}async onSendTransactions(){const t=this.selectedPaymentAsset?.amount??"0",n=v.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!v.bigNumber(t).gte(n)){S.showError("Insufficient funds");return}const r=Ye(this.quote),[i]=Ye(this.quote,this.completedTransactionsCount);i&&this.namespace&&(await p.onSendTransaction({namespace:this.namespace,transactionStep:i}),this.completedTransactionsCount+=1,this.completedTransactionsCount===r.length&&(p.setRequestId(i.requestId),m.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){const t=z.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!t)throw new Error("Could not create popup window");t.location.href=this.exchangeUrlForQuote;const n=Je(this.quote);n&&p.setRequestId(n.requestId),p.initiatePayment(),m.push("PayLoading")}}resetAssetsState(){p.setSelectedPaymentAsset(null)}resetQuoteState(){p.resetQuoteState()}};C.styles=oi;$([h()],C.prototype,"profileName",void 0);$([h()],C.prototype,"paymentAsset",void 0);$([h()],C.prototype,"namespace",void 0);$([h()],C.prototype,"caipAddress",void 0);$([h()],C.prototype,"amount",void 0);$([h()],C.prototype,"recipient",void 0);$([h()],C.prototype,"activeConnectorIds",void 0);$([h()],C.prototype,"selectedPaymentAsset",void 0);$([h()],C.prototype,"selectedExchange",void 0);$([h()],C.prototype,"isFetchingQuote",void 0);$([h()],C.prototype,"quoteError",void 0);$([h()],C.prototype,"quote",void 0);$([h()],C.prototype,"isFetchingTokenBalances",void 0);$([h()],C.prototype,"tokenBalances",void 0);$([h()],C.prototype,"isPaymentInProgress",void 0);$([h()],C.prototype,"exchangeUrlForQuote",void 0);$([h()],C.prototype,"completedTransactionsCount",void 0);C=$([x("w3m-pay-quote-view")],C);const si=A`
  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .transfers-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }
`;var ht=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Ee=class extends T{constructor(){super(),this.unsubscribe=[],this.paymentAsset=p.state.paymentAsset,this.amount=p.state.amount,this.unsubscribe.push(p.subscribeKey("paymentAsset",t=>{this.paymentAsset=t}),p.subscribeKey("amount",t=>{this.amount=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const n=f.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===this.paymentAsset.network);return c`<wui-flex
      alignItems="center"
      gap="1"
      .padding=${["1","2","1","1"]}
      class="transfers-badge"
    >
      <wui-image src=${k(this.paymentAsset.metadata.logoURI)} size="xl"></wui-image>
      <wui-text variant="lg-regular" color="primary">
        ${this.amount} ${this.paymentAsset.metadata.symbol}
      </wui-text>
      <wui-text variant="sm-regular" color="secondary">
        on ${n?.name??"Unknown"}
      </wui-text>
    </wui-flex>`}};Ee.styles=[si];ht([d()],Ee.prototype,"paymentAsset",void 0);ht([d()],Ee.prototype,"amount",void 0);Ee=ht([x("w3m-pay-header")],Ee);const ai=A`
  :host {
    height: 60px;
  }

  :host > wui-flex {
    box-sizing: border-box;
    background-color: var(--local-header-background-color);
  }

  wui-text {
    background-color: var(--local-header-background-color);
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-down-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards ${({easings:e})=>e["ease-out-power-2"]},
      slide-up-in 120ms forwards ${({easings:e})=>e["ease-out-power-2"]};
    animation-delay: 0ms, 200ms;
  }

  wui-icon-button[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var le=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const ci=["SmartSessionList"],li={PayWithExchange:Te.tokens.theme.foregroundPrimary};function Ct(){const e=m.state.data?.connector?.name,t=m.state.data?.wallet?.name,n=m.state.data?.network?.name,o=t??e,r=U.getConnectors(),i=r.length===1&&r[0]?.id==="w3m-email",s=f.getAccountData()?.socialProvider,a=s?s.charAt(0).toUpperCase()+s.slice(1):"Connect Social";return{Connect:`Connect ${i?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",UsageExceeded:"Usage Exceeded",ConnectingExternal:o??"Connect Wallet",ConnectingWalletConnect:o??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview Convert",Downloads:o?`Get ${o}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a Wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:n??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade Your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose Name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select Token",SwapPreview:"Preview Swap",WalletSend:"Send",WalletSendPreview:"Review Send",WalletSendSelectToken:"Select Token",WalletSendConfirmed:"Confirmed",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a Wallet?",ConnectWallets:"Connect Wallet",ConnectSocials:"All Socials",ConnectingSocial:a,ConnectingMultiChain:"Select Chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch Chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Processing payment...",PayQuote:"Payment Quote",DataCapture:"Profile",DataCaptureOtpConfirm:"Confirm Email",FundWallet:"Fund Wallet",PayWithExchange:"Deposit from Exchange",PayWithExchangeSelectAsset:"Select Asset",SmartAccountSettings:"Smart Account Settings"}}let K=class extends T{constructor(){super(),this.unsubscribe=[],this.heading=Ct()[m.state.view],this.network=f.state.activeCaipNetwork,this.networkImage=L.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=m.state.view,this.viewDirection="",this.unsubscribe.push(Qt.subscribeNetworkImages(()=>{this.networkImage=L.getNetworkImage(this.network)}),m.subscribeKey("view",t=>{setTimeout(()=>{this.view=t,this.heading=Ct()[t]},ue.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),f.subscribeKey("activeCaipNetwork",t=>{this.network=t,this.networkImage=L.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){const t=li[m.state.view]??Te.tokens.theme.backgroundPrimary;return this.style.setProperty("--local-header-background-color",t),c`
      <wui-flex
        .padding=${["0","4","0","4"]}
        justifyContent="space-between"
        alignItems="center"
      >
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){D.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),m.push("WhatIsAWallet")}async onClose(){await Dt.safeClose()}rightHeaderTemplate(){const t=E?.state?.features?.smartSessions;return m.state.view!=="Account"||!t?this.closeButtonTemplate():c`<wui-flex>
      <wui-icon-button
        icon="clock"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${()=>m.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-button>
      ${this.closeButtonTemplate()}
    </wui-flex> `}closeButtonTemplate(){return c`
      <wui-icon-button
        icon="close"
        size="lg"
        type="neutral"
        variant="primary"
        iconSize="lg"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-button>
    `}titleTemplate(){if(this.view==="PayQuote")return c`<w3m-pay-header></w3m-pay-header>`;const t=ci.includes(this.view);return c`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="2"
      >
        <wui-text
          display="inline"
          variant="lg-regular"
          color="primary"
          data-testid="w3m-header-text"
        >
          ${this.heading}
        </wui-text>
        ${t?c`<wui-tag variant="accent" size="md">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){const{view:t}=m.state,n=t==="Connect",o=E.state.enableEmbedded,r=t==="ApproveTransaction",i=t==="ConnectingSiwe",s=t==="Account",a=E.state.enableNetworkSwitch,b=r||i||n&&o;return s&&a?c`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${k(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${k(this.networkImage)}
      ></wui-select>`:this.showBack&&!b?c`<wui-icon-button
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        size="lg"
        iconSize="lg"
        type="neutral"
        variant="primary"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-button>`:c`<wui-icon-button
      data-hidden=${!n}
      id="dynamic"
      icon="helpCircle"
      size="lg"
      iconSize="lg"
      type="neutral"
      variant="primary"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-button>`}onNetworks(){this.isAllowedNetworkSwitch()&&(D.sendEvent({type:"track",event:"CLICK_NETWORKS"}),m.push("Networks"))}isAllowedNetworkSwitch(){const t=f.getAllRequestedCaipNetworks(),n=t?t.length>1:!1,o=t?.find(({id:r})=>r===this.network?.id);return n||!o}onViewChange(){const{history:t}=m.state;let n=ue.VIEW_DIRECTION.Next;t.length<this.prevHistoryLength&&(n=ue.VIEW_DIRECTION.Prev),this.prevHistoryLength=t.length,this.viewDirection=n}async onHistoryChange(){const{history:t}=m.state,n=this.shadowRoot?.querySelector("#dynamic");t.length>1&&!this.showBack&&n?(await n.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,n.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):t.length<=1&&this.showBack&&n&&(await n.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,n.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){m.goBack()}};K.styles=ai;le([h()],K.prototype,"heading",void 0);le([h()],K.prototype,"network",void 0);le([h()],K.prototype,"networkImage",void 0);le([h()],K.prototype,"showBack",void 0);le([h()],K.prototype,"prevHistoryLength",void 0);le([h()],K.prototype,"view",void 0);le([h()],K.prototype,"viewDirection",void 0);K=le([x("w3m-header")],K);const ui=A`
  :host {
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    box-shadow:
      0px 0px 8px 0px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px ${({tokens:e})=>e.theme.borderPrimary};
    max-width: 320px;
  }

  wui-icon-box {
    border-radius: ${({borderRadius:e})=>e.round} !important;
    overflow: hidden;
  }

  wui-loading-spinner {
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    border-radius: ${({borderRadius:e})=>e.round} !important;
  }
`;var mt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Ie=class extends T{constructor(){super(...arguments),this.message="",this.variant="success"}render(){return c`
      ${this.templateIcon()}
      <wui-text variant="lg-regular" color="primary" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){const t={success:"success",error:"error",warning:"warning",info:"default"},n={success:"checkmark",error:"warning",warning:"warningCircle",info:"info"};return this.variant==="loading"?c`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:c`<wui-icon-box
      size="md"
      color=${t[this.variant]}
      icon=${n[this.variant]}
    ></wui-icon-box>`}};Ie.styles=[X,ui];mt([d()],Ie.prototype,"message",void 0);mt([d()],Ie.prototype,"variant",void 0);Ie=mt([x("wui-snackbar")],Ie);const di=Ve`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var zt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let je=class extends T{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=S.state.open,this.unsubscribe.push(S.subscribeKey("open",t=>{this.open=t,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(t=>t())}render(){const{message:t,variant:n}=S.state;return c` <wui-snackbar message=${t} variant=${n}></wui-snackbar> `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),S.state.autoClose&&(this.timeout=setTimeout(()=>S.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};je.styles=di;zt([h()],je.prototype,"open",void 0);je=zt([x("w3m-snackbar")],je);const pi=Ve`
  :host {
    width: 100%;
    display: block;
  }
`;var wt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Ce=class extends T{constructor(){super(),this.unsubscribe=[],this.text="",this.open=F.state.open,this.unsubscribe.push(m.subscribeKey("view",()=>{F.hide()}),O.subscribeKey("open",t=>{t||F.hide()}),F.subscribeKey("open",t=>{this.open=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),F.hide()}render(){return c`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return c`<slot></slot> `}onMouseEnter(){const t=this.getBoundingClientRect();if(!this.open){const n=document.querySelector("w3m-modal"),o={width:t.width,height:t.height,left:t.left,top:t.top};if(n){const r=n.getBoundingClientRect();o.left=t.left-(window.innerWidth-r.width)/2,o.top=t.top-(window.innerHeight-r.height)/2}F.showTooltip({message:this.text,triggerRect:o,variant:"shade"})}}onMouseLeave(t){this.contains(t.relatedTarget)||F.hide()}};Ce.styles=[pi];wt([d()],Ce.prototype,"text",void 0);wt([h()],Ce.prototype,"open",void 0);Ce=wt([x("w3m-tooltip-trigger")],Ce);const hi=A`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px ${({spacing:e})=>e[3]} 10px ${({spacing:e})=>e[3]};
    border-radius: ${({borderRadius:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.backgroundPrimary};
    position: absolute;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--apkt-modal-width) - ${({spacing:e})=>e[5]});
    transition: opacity ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var $e=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let de=class extends T{constructor(){super(),this.unsubscribe=[],this.open=F.state.open,this.message=F.state.message,this.triggerRect=F.state.triggerRect,this.variant=F.state.variant,this.unsubscribe.push(F.subscribe(t=>{this.open=t.open,this.message=t.message,this.triggerRect=t.triggerRect,this.variant=t.variant}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){this.dataset.variant=this.variant;const t=this.triggerRect.top,n=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${t}px;
    --w3m-tooltip-left: ${n}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,c`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};de.styles=[hi];$e([h()],de.prototype,"open",void 0);$e([h()],de.prototype,"message",void 0);$e([h()],de.prototype,"triggerRect",void 0);$e([h()],de.prototype,"variant",void 0);de=$e([x("w3m-tooltip")],de);const ke={getTabsByNamespace(e){return!!e&&e===I.CHAIN.EVM?E.state.remoteFeatures?.activity===!1?ue.ACCOUNT_TABS.filter(n=>n.label!=="Activity"):ue.ACCOUNT_TABS:[]},isValidReownName(e){return/^[a-zA-Z0-9]+$/gu.test(e)},isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(e)},validateReownName(e){return e.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,"")},hasFooter(){const e=m.state.view;if(ue.VIEWS_WITH_LEGAL_FOOTER.includes(e)){const{termsConditionsUrl:t,privacyPolicyUrl:n}=E.state,o=E.state.features?.legalCheckbox;return!(!t&&!n||o)}return ue.VIEWS_WITH_DEFAULT_FOOTER.includes(e)}},mi=A`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:e})=>e[3]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:e})=>e.core.textAccentPrimary};
    font-weight: 500;
  }
`;var jt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Me=class extends T{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=E.state.remoteFeatures,this.unsubscribe.push(E.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){const{termsConditionsUrl:t,privacyPolicyUrl:n}=E.state,o=E.state.features?.legalCheckbox;return!t&&!n||o?c`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:c`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){const{termsConditionsUrl:t,privacyPolicyUrl:n}=E.state;return t&&n?"and":""}termsTemplate(){const{termsConditionsUrl:t}=E.state;return t?c`<a href=${t} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){const{privacyPolicyUrl:t}=E.state;return t?c`<a href=${t} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(t=!1){return this.remoteFeatures?.reownBranding?t?c`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:c`<wui-ux-by-reown></wui-ux-by-reown>`:null}};Me.styles=[mi];jt([h()],Me.prototype,"remoteFeatures",void 0);Me=jt([x("w3m-legal-footer")],Me);const wi=Ve``;var fi=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let it=class extends T{render(){const{termsConditionsUrl:t,privacyPolicyUrl:n}=E.state;return!t&&!n?null:c`
      <wui-flex
        .padding=${["4","3","3","3"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `}howDoesItWorkTemplate(){return c` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){D.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:Ue(f.state.activeChain)===We.ACCOUNT_TYPES.SMART_ACCOUNT}}),m.push("WhatIsABuy")}};it.styles=[wi];it=fi([x("w3m-onramp-providers-footer")],it);const gi=A`
  :host {
    display: block;
  }

  div.container {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    height: auto;
    display: block;
  }

  div.container[status='hide'] {
    animation: fade-out;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: 0s;
  }

  div.container[status='show'] {
    animation: fade-in;
    animation-duration: var(--apkt-duration-dynamic);
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      filter: blur(6px);
    }
    to {
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
      filter: blur(0px);
    }
    to {
      opacity: 0;
      filter: blur(6px);
    }
  }
`;var ft=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Pe=class extends T{constructor(){super(...arguments),this.resizeObserver=void 0,this.unsubscribe=[],this.status="hide",this.view=m.state.view}firstUpdated(){this.status=ke.hasFooter()?"show":"hide",this.unsubscribe.push(m.subscribeKey("view",t=>{this.view=t,this.status=ke.hasFooter()?"show":"hide",this.status==="hide"&&document.documentElement.style.setProperty("--apkt-footer-height","0px")})),this.resizeObserver=new ResizeObserver(t=>{for(const n of t)if(n.target===this.getWrapper()){const o=`${n.contentRect.height}px`;document.documentElement.style.setProperty("--apkt-footer-height",o)}}),this.resizeObserver.observe(this.getWrapper())}render(){return c`
      <div class="container" status=${this.status}>${this.templatePageContainer()}</div>
    `}templatePageContainer(){return ke.hasFooter()?c` ${this.templateFooter()}`:null}templateFooter(){switch(this.view){case"Networks":return this.templateNetworksFooter();case"Connect":case"ConnectWallets":case"OnRampFiatSelect":case"OnRampTokenSelect":return c`<w3m-legal-footer></w3m-legal-footer>`;case"OnRampProviders":return c`<w3m-onramp-providers-footer></w3m-onramp-providers-footer>`;default:return null}}templateNetworksFooter(){return c` <wui-flex
      class="footer-in"
      padding="3"
      flexDirection="column"
      gap="3"
      alignItems="center"
    >
      <wui-text variant="md-regular" color="secondary" align="center">
        Your connected wallet may not support some of the networks available for this dApp
      </wui-text>
      <wui-link @click=${this.onNetworkHelp.bind(this)}>
        <wui-icon size="sm" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
        What is a network
      </wui-link>
    </wui-flex>`}onNetworkHelp(){D.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),m.push("WhatIsANetwork")}getWrapper(){return this.shadowRoot?.querySelector("div.container")}};Pe.styles=[gi];ft([h()],Pe.prototype,"status",void 0);ft([h()],Pe.prototype,"view",void 0);Pe=ft([x("w3m-footer")],Pe);const yi=A`
  :host {
    display: block;
    width: inherit;
  }
`;var gt=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let Ne=class extends T{constructor(){super(),this.unsubscribe=[],this.viewState=m.state.view,this.history=m.state.history.join(","),this.unsubscribe.push(m.subscribeKey("view",()=>{this.history=m.state.history.join(","),document.documentElement.style.setProperty("--apkt-duration-dynamic","var(--apkt-durations-lg)")}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),document.documentElement.style.setProperty("--apkt-duration-dynamic","0s")}render(){return c`${this.templatePageContainer()}`}templatePageContainer(){return c`<w3m-router-container
      history=${this.history}
      .setView=${()=>{this.viewState=m.state.view}}
    >
      ${this.viewTemplate(this.viewState)}
    </w3m-router-container>`}viewTemplate(t){switch(t){case"AccountSettings":return c`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return c`<w3m-account-view></w3m-account-view>`;case"AllWallets":return c`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return c`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return c`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return c`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":return c`<w3m-connect-view></w3m-connect-view>`;case"Create":return c`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return c`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return c`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return c`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return c`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return c`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return c`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return c`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"DataCapture":return c`<w3m-data-capture-view></w3m-data-capture-view>`;case"DataCaptureOtpConfirm":return c`<w3m-data-capture-otp-confirm-view></w3m-data-capture-otp-confirm-view>`;case"Downloads":return c`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return c`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return c`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return c`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return c`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return c`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return c`<w3m-network-switch-view></w3m-network-switch-view>`;case"ProfileWallets":return c`<w3m-profile-wallets-view></w3m-profile-wallets-view>`;case"Transactions":return c`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return c`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampTokenSelect":return c`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return c`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return c`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return c`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return c`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return c`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return c`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return c`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return c`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return c`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return c`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return c`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return c`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WalletSendConfirmed":return c`<w3m-send-confirmed-view></w3m-send-confirmed-view>`;case"WhatIsABuy":return c`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return c`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return c`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return c`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return c`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return c`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return c`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return c`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return c`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return c`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return c`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return c`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return c`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;case"Pay":return c`<w3m-pay-view></w3m-pay-view>`;case"PayLoading":return c`<w3m-pay-loading-view></w3m-pay-loading-view>`;case"PayQuote":return c`<w3m-pay-quote-view></w3m-pay-quote-view>`;case"FundWallet":return c`<w3m-fund-wallet-view></w3m-fund-wallet-view>`;case"PayWithExchange":return c`<w3m-deposit-from-exchange-view></w3m-deposit-from-exchange-view>`;case"PayWithExchangeSelectAsset":return c`<w3m-deposit-from-exchange-select-asset-view></w3m-deposit-from-exchange-select-asset-view>`;case"UsageExceeded":return c`<w3m-usage-exceeded-view></w3m-usage-exceeded-view>`;case"SmartAccountSettings":return c`<w3m-smart-account-settings-view></w3m-smart-account-settings-view>`;default:return c`<w3m-connect-view></w3m-connect-view>`}}};Ne.styles=[yi];gt([h()],Ne.prototype,"viewState",void 0);gt([h()],Ne.prototype,"history",void 0);Ne=gt([x("w3m-router")],Ne);const bi=A`
  :host {
    z-index: ${({tokens:e})=>e.core.zIndex};
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: ${({tokens:e})=>e.theme.overlay};
    backdrop-filter: blur(0px);
    transition:
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      backdrop-filter ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
    backdrop-filter: blur(8px);
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--apkt-modal-width);
    width: 100%;
    position: relative;
    outline: none;
    transform: translateY(4px);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
    transition:
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: border-radius, background-color, transform, box-shadow;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    padding: var(--local-modal-padding);
    box-sizing: border-box;
  }

  :host(.open) wui-card {
    transform: translateY(0px);
  }

  wui-card::before {
    z-index: 1;
    pointer-events: none;
    content: '';
    position: absolute;
    inset: 0;
    border-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    transition: box-shadow ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    transition-delay: ${({durations:e})=>e.md};
    will-change: box-shadow;
  }

  :host([data-mobile-fullscreen='true']) wui-card::before {
    border-radius: 0px;
  }

  :host([data-border='true']) wui-card::before {
    box-shadow: inset 0px 0px 0px 4px ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  :host([data-border='false']) wui-card::before {
    box-shadow: inset 0px 0px 0px 1px ${({tokens:e})=>e.theme.borderPrimaryDark};
  }

  :host([data-border='true']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-border var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: var(--apkt-duration-dynamic);
  }

  :host([data-border='false']) wui-card {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      card-background-default var(--apkt-duration-dynamic)
        ${({easings:e})=>e["ease-out-power-2"]};
    animation-fill-mode: backwards, both;
    animation-delay: 0s;
  }

  :host(.appkit-modal) wui-card {
    max-width: var(--apkt-modal-width);
  }

  wui-card[shake='true'] {
    animation:
      fade-in ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      w3m-shake ${({durations:e})=>e.xl}
        ${({easings:e})=>e["ease-out-power-2"]};
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--apkt-spacing-6) 0px;
    }
  }

  @media (max-width: 430px) {
    :host([data-mobile-fullscreen='true']) {
      height: 100dvh;
    }
    :host([data-mobile-fullscreen='true']) wui-flex {
      align-items: stretch;
    }
    :host([data-mobile-fullscreen='true']) wui-card {
      max-width: 100%;
      height: 100%;
      border-radius: 0;
      border: none;
    }
    :host(:not([data-mobile-fullscreen='true'])) wui-flex {
      align-items: flex-end;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card {
      max-width: 100%;
      border-bottom: none;
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card[data-embedded='true'] {
      border-bottom-left-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
      border-bottom-right-radius: clamp(0px, var(--apkt-borderRadius-8), 44px);
    }

    :host(:not([data-mobile-fullscreen='true'])) wui-card:not([data-embedded='true']) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }

    wui-card[shake='true'] {
      animation: w3m-shake 0.5s ${({easings:e})=>e["ease-out-power-2"]};
    }
  }

  @keyframes fade-in {
    0% {
      transform: scale(0.99) translateY(4px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes card-background-border {
    from {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  @keyframes card-background-default {
    from {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
    to {
      background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    }
  }
`;var J=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const Pt="scroll-lock",vi={PayWithExchange:"0",PayWithExchangeSelectAsset:"0",Pay:"0",PayQuote:"0",PayLoading:"0"};class G extends T{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=E.state.enableEmbedded,this.open=O.state.open,this.caipAddress=f.state.activeCaipAddress,this.caipNetwork=f.state.activeCaipNetwork,this.shake=O.state.shake,this.filterByNamespace=U.state.filterByNamespace,this.padding=Te.spacing[1],this.mobileFullScreen=E.state.enableMobileFullScreen,this.initializeTheming(),Re.prefetchAnalyticsConfig(),this.unsubscribe.push(O.subscribeKey("open",t=>t?this.onOpen():this.onClose()),O.subscribeKey("shake",t=>this.shake=t),f.subscribeKey("activeCaipNetwork",t=>this.onNewNetwork(t)),f.subscribeKey("activeCaipAddress",t=>this.onNewAddress(t)),E.subscribeKey("enableEmbedded",t=>this.enableEmbedded=t),U.subscribeKey("filterByNamespace",t=>{this.filterByNamespace!==t&&!f.getAccountData(t)?.caipAddress&&(Re.fetchRecommendedWallets(),this.filterByNamespace=t)}),m.subscribeKey("view",()=>{this.dataset.border=ke.hasFooter()?"true":"false",this.padding=vi[m.state.view]??Te.spacing[1]}))}firstUpdated(){if(this.dataset.border=ke.hasFooter()?"true":"false",this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.caipAddress){if(this.enableEmbedded){O.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.onRemoveKeyboardListener()}render(){return this.style.setProperty("--local-modal-padding",this.padding),this.enableEmbedded?c`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?c`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return c` <wui-card
      shake="${this.shake}"
      data-embedded="${k(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-footer></w3m-footer>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(t){if(t.target===t.currentTarget){if(this.mobileFullScreen)return;await this.handleClose()}}async handleClose(){await Dt.safeClose()}initializeTheming(){const{themeVariables:t,themeMode:n}=Kt.state,o=He.getColorTheme(n);Xt(t,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),S.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){const t=document.createElement("style");t.dataset.w3m=Pt,t.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(t)}onScrollUnlock(){const t=document.head.querySelector(`style[data-w3m="${Pt}"]`);t&&t.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const t=this.shadowRoot?.querySelector("wui-card");t?.focus(),window.addEventListener("keydown",n=>{if(n.key==="Escape")this.handleClose();else if(n.key==="Tab"){const{tagName:o}=n.target;o&&!o.includes("W3M-")&&!o.includes("WUI-")&&t?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(t){const n=f.state.isSwitchingNamespace,o=m.state.view==="ProfileWallets";!t&&!n&&!o&&O.close(),await Ot.initializeIfEnabled(t),this.caipAddress=t,f.setIsSwitchingNamespace(!1)}onNewNetwork(t){const o=this.caipNetwork?.caipNetworkId?.toString(),r=t?.caipNetworkId?.toString(),i=o!==r,s=m.state.view==="UnsupportedChain",a=O.state.open;let b=!1;this.enableEmbedded&&m.state.view==="SwitchNetwork"&&(b=!0),i&&w.resetState(),a&&s&&(b=!0),b&&m.state.view!=="SIWXSignMessage"&&m.goBack(),this.caipNetwork=t}prefetch(){this.hasPrefetched||(Re.prefetch(),Re.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}}G.styles=bi;J([d({type:Boolean})],G.prototype,"enableEmbedded",void 0);J([h()],G.prototype,"open",void 0);J([h()],G.prototype,"caipAddress",void 0);J([h()],G.prototype,"caipNetwork",void 0);J([h()],G.prototype,"shake",void 0);J([h()],G.prototype,"filterByNamespace",void 0);J([h()],G.prototype,"padding",void 0);J([h()],G.prototype,"mobileFullScreen",void 0);let Nt=class extends G{};Nt=J([x("w3m-modal")],Nt);let $t=class extends G{};$t=J([x("appkit-modal")],$t);const xi=A`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: ${({borderRadius:e})=>e[5]};
    background-color: ${({colors:e})=>e.semanticError010};
  }
`;var ki=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let ot=class extends T{constructor(){super()}render(){return c`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="error" name="warningCircle"></wui-icon>
        </wui-flex>

        <wui-text variant="lg-medium" color="primary" align="center">
          The app isn't responding as expected
        </wui-text>
        <wui-text variant="md-regular" color="secondary" align="center">
          Try again or reach out to the app team for help.
        </wui-text>

        <wui-button
          variant="neutral-secondary"
          size="md"
          @click=${this.onTryAgainClick.bind(this)}
          data-testid="w3m-usage-exceeded-button"
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try Again
        </wui-button>
      </wui-flex>
    `}onTryAgainClick(){m.goBack()}};ot.styles=xi;ot=ki([x("w3m-usage-exceeded-view")],ot);const Ti=A`
  :host {
    width: 100%;
  }
`;var _=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};let N=class extends T{constructor(){super(...arguments),this.hasImpressionSent=!1,this.walletImages=[],this.imageSrc="",this.name="",this.size="md",this.tabIdx=void 0,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100",this.rdnsId="",this.displayIndex=void 0,this.walletRank=void 0,this.namespaces=[]}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this.cleanupIntersectionObserver()}updated(t){super.updated(t),(t.has("name")||t.has("imageSrc")||t.has("walletRank"))&&(this.hasImpressionSent=!1),t.has("walletRank")&&this.walletRank&&!this.intersectionObserver&&this.setupIntersectionObserver()}setupIntersectionObserver(){this.intersectionObserver=new IntersectionObserver(t=>{t.forEach(n=>{n.isIntersecting&&!this.loading&&!this.hasImpressionSent&&this.sendImpressionEvent()})},{threshold:.1}),this.intersectionObserver.observe(this)}cleanupIntersectionObserver(){this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=void 0)}sendImpressionEvent(){!this.name||this.hasImpressionSent||!this.walletRank||(this.hasImpressionSent=!0,(this.rdnsId||this.name)&&D.sendWalletImpressionEvent({name:this.name,walletRank:this.walletRank,rdnsId:this.rdnsId,view:m.state.view,displayIndex:this.displayIndex}))}handleGetWalletNamespaces(){return Object.keys(Zt.state.adapters).length>1?this.namespaces:[]}render(){return c`
      <wui-list-wallet
        .walletImages=${this.walletImages}
        imageSrc=${k(this.imageSrc)}
        name=${this.name}
        size=${k(this.size)}
        tagLabel=${k(this.tagLabel)}
        .tagVariant=${this.tagVariant}
        .walletIcon=${this.walletIcon}
        .tabIdx=${this.tabIdx}
        .disabled=${this.disabled}
        .showAllWallets=${this.showAllWallets}
        .loading=${this.loading}
        loadingSpinnerColor=${this.loadingSpinnerColor}
        .namespaces=${this.handleGetWalletNamespaces()}
      ></wui-list-wallet>
    `}};N.styles=Ti;_([d({type:Array})],N.prototype,"walletImages",void 0);_([d()],N.prototype,"imageSrc",void 0);_([d()],N.prototype,"name",void 0);_([d()],N.prototype,"size",void 0);_([d()],N.prototype,"tagLabel",void 0);_([d()],N.prototype,"tagVariant",void 0);_([d()],N.prototype,"walletIcon",void 0);_([d()],N.prototype,"tabIdx",void 0);_([d({type:Boolean})],N.prototype,"disabled",void 0);_([d({type:Boolean})],N.prototype,"showAllWallets",void 0);_([d({type:Boolean})],N.prototype,"loading",void 0);_([d({type:String})],N.prototype,"loadingSpinnerColor",void 0);_([d()],N.prototype,"rdnsId",void 0);_([d()],N.prototype,"displayIndex",void 0);_([d()],N.prototype,"walletRank",void 0);_([d({type:Array})],N.prototype,"namespaces",void 0);N=_([x("w3m-list-wallet")],N);const Ai=A`
  :host {
    --local-duration-height: 0s;
    --local-duration: ${({durations:e})=>e.lg};
    --local-transition: ${({easings:e})=>e["ease-out-power-2"]};
  }

  .container {
    display: block;
    overflow: hidden;
    overflow: hidden;
    position: relative;
    height: var(--local-container-height);
    transition: height var(--local-duration-height) var(--local-transition);
    will-change: height, padding-bottom;
  }

  .container[data-mobile-fullscreen='true'] {
    overflow: scroll;
  }

  .page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    width: inherit;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-bottom-left-radius: var(--local-border-bottom-radius);
    border-bottom-right-radius: var(--local-border-bottom-radius);
    transition: border-bottom-left-radius var(--local-duration) var(--local-transition);
  }

  .page[data-mobile-fullscreen='true'] {
    height: 100%;
  }

  .page-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .footer {
    height: var(--apkt-footer-height);
  }

  div.page[view-direction^='prev-'] .page-content {
    animation:
      slide-left-out var(--local-duration) forwards var(--local-transition),
      slide-left-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  div.page[view-direction^='next-'] .page-content {
    animation:
      slide-right-out var(--local-duration) forwards var(--local-transition),
      slide-right-in var(--local-duration) forwards var(--local-transition);
    animation-delay: 0ms, var(--local-duration, ${({durations:e})=>e.lg});
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
    to {
      transform: translateX(-8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(8px) scale(0.99);
      opacity: 0;
      filter: blur(4px);
    }
    to {
      transform: translateX(0) translateY(0) scale(1);
      opacity: 1;
      filter: blur(0px);
    }
  }
`;var ee=function(e,t,n,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,n):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,n,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(r<3?s(i):r>3?s(t,n,i):s(t,n))||i);return r>3&&i&&Object.defineProperty(t,n,i),i};const Si=60;let M=class extends T{constructor(){super(...arguments),this.resizeObserver=void 0,this.transitionDuration="0.15s",this.transitionFunction="",this.history="",this.view="",this.setView=void 0,this.viewDirection="",this.historyState="",this.previousHeight="0px",this.mobileFullScreen=E.state.enableMobileFullScreen,this.onViewportResize=()=>{this.updateContainerHeight()}}updated(t){if(t.has("history")){const n=this.history;this.historyState!==""&&this.historyState!==n&&this.onViewChange(n)}t.has("transitionDuration")&&this.style.setProperty("--local-duration",this.transitionDuration),t.has("transitionFunction")&&this.style.setProperty("--local-transition",this.transitionFunction)}firstUpdated(){this.transitionFunction&&this.style.setProperty("--local-transition",this.transitionFunction),this.style.setProperty("--local-duration",this.transitionDuration),this.historyState=this.history,this.resizeObserver=new ResizeObserver(t=>{for(const n of t)if(n.target===this.getWrapper()){let o=n.contentRect.height;const r=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");if(this.mobileFullScreen){const i=window.visualViewport?.height||window.innerHeight,s=this.getHeaderHeight();o=i-s-r,this.style.setProperty("--local-border-bottom-radius","0px")}else o=o+r,this.style.setProperty("--local-border-bottom-radius",r?"var(--apkt-borderRadius-5)":"0px");this.style.setProperty("--local-container-height",`${o}px`),this.previousHeight!=="0px"&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${o}px`}}),this.resizeObserver.observe(this.getWrapper()),this.updateContainerHeight(),window.addEventListener("resize",this.onViewportResize),window.visualViewport?.addEventListener("resize",this.onViewportResize)}disconnectedCallback(){const t=this.getWrapper();t&&this.resizeObserver&&this.resizeObserver.unobserve(t),window.removeEventListener("resize",this.onViewportResize),window.visualViewport?.removeEventListener("resize",this.onViewportResize)}render(){return c`
      <div class="container" data-mobile-fullscreen="${k(this.mobileFullScreen)}">
        <div
          class="page"
          data-mobile-fullscreen="${k(this.mobileFullScreen)}"
          view-direction="${this.viewDirection}"
        >
          <div class="page-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `}onViewChange(t){const n=t.split(",").filter(Boolean),o=this.historyState.split(",").filter(Boolean),r=o.length,i=n.length,s=n[n.length-1]||"",a=He.cssDurationToNumber(this.transitionDuration);let b="";i>r?b="next":i<r?b="prev":i===r&&n[i-1]!==o[r-1]&&(b="next"),this.viewDirection=`${b}-${s}`,setTimeout(()=>{this.historyState=t,this.setView?.(s)},a),setTimeout(()=>{this.viewDirection=""},a*2)}getWrapper(){return this.shadowRoot?.querySelector("div.page")}updateContainerHeight(){const t=this.getWrapper();if(!t)return;const n=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--apkt-footer-height")||"0");let o=0;if(this.mobileFullScreen){const r=window.visualViewport?.height||window.innerHeight,i=this.getHeaderHeight();o=r-i-n,this.style.setProperty("--local-border-bottom-radius","0px")}else o=t.getBoundingClientRect().height+n,this.style.setProperty("--local-border-bottom-radius",n?"var(--apkt-borderRadius-5)":"0px");this.style.setProperty("--local-container-height",`${o}px`),this.previousHeight!=="0px"&&this.style.setProperty("--local-duration-height",this.transitionDuration),this.previousHeight=`${o}px`}getHeaderHeight(){return Si}};M.styles=[Ai];ee([d({type:String})],M.prototype,"transitionDuration",void 0);ee([d({type:String})],M.prototype,"transitionFunction",void 0);ee([d({type:String})],M.prototype,"history",void 0);ee([d({type:String})],M.prototype,"view",void 0);ee([d({attribute:!1})],M.prototype,"setView",void 0);ee([h()],M.prototype,"viewDirection",void 0);ee([h()],M.prototype,"historyState",void 0);ee([h()],M.prototype,"previousHeight",void 0);ee([h()],M.prototype,"mobileFullScreen",void 0);M=ee([x("w3m-router-container")],M);export{$t as AppKitModal,N as W3mListWallet,Nt as W3mModal,G as W3mModalBase,M as W3mRouterContainer,ot as W3mUsageExceededView};

