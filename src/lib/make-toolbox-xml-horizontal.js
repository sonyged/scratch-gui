const categorySeparator = '<sep gap="36"/>';

// const blockSeparator = '<sep gap="36"/>'; // At default scale, about 28px

const events = function () {
    return `
        <category name="%{BKY_CATEGORY_EVENTS}" id="events">
            <block type="event_whenflagclicked"></block>
            <block type="event_whenbroadcastreceived">
            <value name="CHOICE">
            <shadow type="dropdown_whenbroadcast">
            <field name="CHOICE">blue</field>
            </shadow>
            </value>
            </block>
            <block type="event_broadcast">
            <value name="CHOICE">
            <shadow type="dropdown_broadcast">
            <field name="CHOICE">blue</field>
            </shadow>
            </value>
            </block>
        </category>
    `;
};

const control = function () {
    return `
        <category name="%{BKY_CATEGORY_CONTROL}" id="control">
            <block type="control_forever"></block>
            <block type="control_repeat">
            <value name="TIMES">
            <shadow type="math_whole_number">
            <field name="NUM">4</field>
            </shadow>
            </value>
            </block>
            <block type="control_stop"></block>
            <block type="control_wait">
            <value name="DURATION">
            <shadow type="math_positive_number">
            <field name="NUM">1</field>
            </shadow>
            </value>
            </block>
        </category>
    `;
};

const wedo = function () {
    return `
        <category name="Wedo">
            <block type="wedo_setcolor">
            <value name="CHOICE">
            <shadow type="dropdown_wedo_setcolor">
            <field name="CHOICE">mystery</field>
            </shadow>
            </value>
            </block>
            <block type="wedo_motorclockwise">
            <value name="DURATION">
            <shadow type="math_positive_number">
            <field name="NUM">1</field>
            </shadow>
            </value>
            </block>
            <block type="wedo_motorcounterclockwise">
            <value name="DURATION">
            <shadow type="math_positive_number">
            <field name="NUM">1</field>
            </shadow>
            </value>
            </block>
            <block type="wedo_motorspeed">
            <value name="CHOICE">
            <shadow type="dropdown_wedo_motorspeed">
            <field name="CHOICE">fast</field>
            </shadow>
            </value>
            </block>
            <block type="wedo_whentilt">
            <value name="CHOICE">
            <shadow type="dropdown_wedo_whentilt">
            <field name="CHOICE">forward</field>
            </shadow>
            </value>
            </block>
            <block type="wedo_whendistanceclose"></block>
        </category>
    `;
};

const xmlOpen = '<xml style="display: none">';
const xmlClose = '</xml>';

/**
 * @param {!boolean} isStage - Whether the toolbox is for a stage-type target.
 * @param {?string} targetId - The current editing target
 * @param {string?} categoriesXML - null for default toolbox, or an XML string with <category> elements.
 * @returns {string} - a ScratchBlocks-style XML document for the contents of the toolbox.
 */
const makeToolboxXML = function (isStage, targetId, categoriesXML) {
    const gap = [categorySeparator];

    const everything = [
        xmlOpen,
        events(isStage, targetId), gap,
        control(isStage, targetId), gap,
        wedo(isStage, targetId), gap
    ];

    if (categoriesXML) {
        everything.push(gap, categoriesXML);
    }

    everything.push(xmlClose);
    return everything.join('\n');
};

export default makeToolboxXML;
