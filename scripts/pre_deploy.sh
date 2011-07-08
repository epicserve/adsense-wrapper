#!/usr/bin/env bash

source settings

find ../examples/ -name "*.html" | xargs perl -i -wpe "s/$ADSENSE_ACCOUNT_NUMBER/xx-xxx-xxxxxxxxxxxxxxxx/g; s/$LEADERBOARD_SLOT_NAME/leaderboard_ad/g; s/$BIGBOX1_SLOT_NAME/med_rec_ad/g; s/$BIGBOX2_SLOT_NAME/small_rec_ad1/g; s/$BIGBOX3_SLOT_NAME/small_rec_ad2/g;
s/base\.css/base.min.css/g;
s/adsense-wrapper\.js/adsense-wrapper.min.js/g;"


yuicompressor ../css/base.css -o ../css/base.min.css
yuicompressor ../js/adsense-wrapper.js --type js -o ../js/adsense-wrapper.min.js

