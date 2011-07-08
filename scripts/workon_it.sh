#!/usr/bin/env bash

source settings

find ../examples/ -name "*.html" | xargs perl -i -wpe "s/xx-xxx-xxxxxxxxxxxxxxxx/$ADSENSE_ACCOUNT_NUMBER/g; s/leaderboard_ad/$LEADERBOARD_SLOT_NAME/g; s/med_rec_ad/$BIGBOX1_SLOT_NAME/g; s/small_rec_ad1/$BIGBOX2_SLOT_NAME/g; s/small_rec_ad2/$BIGBOX3_SLOT_NAME/g;
s/base\.min\.css/base.css/g; s/adsense-wrapper\.min\.js/adsense-wrapper.js/g;"