using System;
using Traisi.Sdk.Attributes;
using Traisi.Sdk.Enums;
using Traisi.Sdk.Interfaces;
using System.Collections;
using System.Collections.Generic;
namespace Traisi.Sdk.Questions
{

    /// <summary>
    /// 
    /// </summary>
    [SurveyQuestion(QuestionResponseType.Json,
    CodeBundleName = "traisi-trip-diary-routes.module.js")]
    public class TripDiaryRoutes : ISurveyQuestion, INestedQuestionHost
    {

        /// <summary>
        /// 
        /// </summary>
        public string TypeName => "trip-diary-routes";


        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public string Icon
        {
            get => "fas fa-route";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public QuestionIconType IconType { get => QuestionIconType.FONT; }


        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        [QuestionConfiguration(ConfigurationValueType.KeyValuePair,
            Name = "Purpose",
            Description = "Purpose of being at location.",
            SurveyBuilderValueType = QuestionBuilderType.MultiSelect)]
        public Dictionary<string, string> Purposes = new Dictionary<string, string>();


        /// <summary>
        /// Configuration definition that mapes location choices to a colour string.
        /// </summary>
        /// <typeparam name="string"></typeparam>
        /// <typeparam name="string"></typeparam>
        /// <returns></returns>
        [QuestionConfiguration(ConfigurationValueType.KeyValuePair,
            Name = "Locations",
            Description = "Locations and their colour keys.",
            SurveyBuilderValueType = QuestionBuilderType.MultiSelect)]
        public Dictionary<string, string> LocationColourMap = new Dictionary<string, string>();


        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<NestedQuestionDefinition> ConfigureNestedQuestions()
        {
            return new List<NestedQuestionDefinition>();
        }

    }
}