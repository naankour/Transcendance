
const prisma = require('../prisma/prismaClient.js');

// récup ou crée la conv
const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body; 

    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId is required' });
    }

    const myId = Number(req.user.id);
    const otherId = Number(otherUserId);

    if (isNaN(otherId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (otherId === myId) {
      return res.status(400).json({ error: "You can't start a conversation with yourself (≖_≖ )" });
    }

    const userOneId = Math.min(myId, otherId);
    const userTwoId = Math.max(myId, otherId);

    let conversation = await prisma.conversations.findUnique({
      where: {
        user_one_id_user_two_id: {
          user_one_id: userOneId,
          user_two_id: userTwoId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversations.create({
        data: {
          user_one_id: userOneId,
          user_two_id: userTwoId,
        },
      });
    }

    return res.json(conversation);
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// liste les conv d'un user
const getMyConversations = async (req, res) => 
{
  try 
  {
    const myId = req.user.id;

    const conversations = await prisma.conversations.findMany({
      where: 
      {
        OR: [{ user_one_id: myId }, { user_two_id: myId }],
      },
      orderBy: { updated_at: 'desc' },
      include: 
      {
        user_one: 
        {
          select: { id: true, username: true, avatar_url: true },
        },
        user_two: 
        {
          select: { id: true, username: true, avatar_url: true },
        },
        messages: 
        {
          orderBy: { created_at: 'desc' },
          take: 1, 
        },
      },
    });

    const formatted = conversations.map((conv) => 
    {
      const otherUser = conv.user_one_id === myId ? conv.user_two : conv.user_one;
      return {
        id: conv.id,
        otherUser,
        lastMessage: conv.messages[0] || null,
        updated_at: conv.updated_at,
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    console.error('MESSAGE:', error.message);
    console.error('STACK:', error.stack);

    return res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
  }
};

// récup les messages d'une conv
const getMessages = async (req, res) => 
{
  try 
  { 
    const myId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await prisma.conversations.findUnique({
      where: { id: Number(conversationId) },
    });

    if (!conversation) 
      return res.status(404).json({ error: 'Conversation not found' });

    if (conversation.user_one_id !== myId && conversation.user_two_id !== myId) 
      return res.status(403).json({ error: "You don't have access to this conversation (ง •̀_•́)ง" });

    const messages = await prisma.messages.findMany({
      where: { conversation_id: Number(conversationId) },
      orderBy: { created_at: 'asc' },
      include: {
        sender: {
          select: { id: true, username: true, avatar_url: true },
        },
      },
    });

    return res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
};