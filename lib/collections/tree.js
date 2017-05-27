const logger = require('../logger/logger');

class Tree {

    /**
     * @param {Object} data
     * @param {[Tree]} childrenTrees
     * @param {Tree} parent
     */
    constructor(data, childrenTrees=[], parent=undefined) {
        this.parent = parent;
        this.data = data;
        this.children = childrenTrees;
    }

    /**
     * @param {Tree} tree
     */
    addChildTree(tree) {
        tree.parent = tree;
        this.children.push(tree)
    }

    /**
     * @param {Function} testFunction
     * @returns {[Object]}
     */
    bfSearchForNodes(testFunction) {
        const foundNodes = [];
        let queue = [];
        let currentNode;
        queue.push(this);

        while(queue.length != 0) {
            currentNode = queue.shift();

            if (testFunction(currentNode.data)) {
                foundNodes.push(currentNode);
            }

            queue = queue.concat(currentNode.children);
        }

        return foundNodes;
    }

    /**
     * @param {Tree} childNode
     */
    popChildNode(childNode) {
        const childNodeIndex = this.children.indexOf(childNode);
        this.children.slice(childNodeIndex, 1);
    }

    /**
     * @param {Tree} nodeToDelete
     */
    cascadeDeleteNodes(nodeToDelete) {

        let queue = [];
        let currentNode;
        queue.push(nodeToDelete);

        this.parent.popChildNode(nodeToDelete);

        while(queue.length != 0) {
            currentNode = queue.shift();

            queue = queue.concat(currentNode.children);

            // delete(currentNode);  TODO This may not work as expected. I might need to pass in a delete function
        }


    }

    /**
     * @param {Function} testFunction
     * @returns {Object}
     */
    bfSearchForSingleNode(testFunction) {
        let queue = [];
        let currentNode;
        queue.push(this);

        while(queue.length != 0) {
            currentNode = queue.shift();

            if (testFunction(currentNode.data)) {
                return currentNode;
            }

            queue = queue.concat(currentNode.children);
            logger.debug(`Queue length ${queue.length}`);
        }
    }
}

module.exports = Tree;