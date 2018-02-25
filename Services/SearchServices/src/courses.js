module.exports = (sequelize,DataTypes) => {
  return sequelize.define('courses', {
      link: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isUrl:true
        }
      },
      title : {
        type:Sequelize.STRING,
        allowNull: false
      },
      description: {
        type:Sequelize.TEXT
      },
      enrollment_start: {
        type: Sequelize.DATE
      },
      enrollment_end: {
        type:Sequelize.DATE
      }
  });
};
